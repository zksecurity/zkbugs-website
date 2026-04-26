#!/usr/bin/env python3
"""Generate public/dataset/tools-evaluation.json from a zkhydra output dir.

Usage:
    python3 scripts/build_tools_evaluation.py <zkhydra_output_dir>

Reads:
    <zkhydra_output_dir>/summary.json
    <zkhydra_output_dir>/{direct,original}/<bug>/ground_truth.json
    <zkhydra_output_dir>/{direct,original}/<bug>/<tool>/{results.json,parsed.json,evaluation.json,raw.txt}
    <zkhydra_output_dir>/report.{both,direct,original}.pdf
    public/dataset/bugs.json (to resolve website_bug_id by Path leaf)

Writes:
    public/dataset/tools-evaluation.json
    public/dataset/tools-evaluation/{both,direct,original}.pdf
"""
from __future__ import annotations

import json
import re
import shutil
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
WEBSITE_BUGS = REPO_ROOT / "public" / "dataset" / "bugs.json"
OUT_JSON = REPO_ROOT / "public" / "dataset" / "tools-evaluation.json"
OUT_PDFS_DIR = REPO_ROOT / "public" / "dataset" / "tools-evaluation"

TOOLS = [
    {
        "id": "picus",
        "dir": "picus",
        "name": "Picus",
        "kind": "Symbolic Verification",
        "url": "https://github.com/Veridise/Picus",
        "description": "SMT-based under-constrained signal detector for circom circuits.",
    },
    {
        "id": "civer",
        "dir": "circom_civer",
        "name": "Civer",
        "kind": "Formal Verification",
        "url": "https://github.com/costa-group/circom_civer",
        "description": "Verifies circom templates against safety annotations.",
    },
    {
        "id": "ecne",
        "dir": "ecneproject",
        "name": "Ecne",
        "kind": "Symbolic Verification",
        "url": "https://github.com/franklynwang/EcneProject",
        "description": "R1CS soundness checker that bounds witnesses against inputs.",
    },
    {
        "id": "circomspect",
        "dir": "circomspect",
        "name": "Circomspect",
        "kind": "Static Analysis",
        "url": "https://github.com/trailofbits/circomspect",
        "description": "Lints circom circuits for known anti-patterns.",
    },
    {
        "id": "zkfuzz",
        "dir": "zkfuzz",
        "name": "zkFuzz",
        "kind": "Fuzzing",
        "url": "https://github.com/saurabh4/zkfuzz",
        "description": "Genetic fuzzer that searches for unsoundness counterexamples.",
    },
]

TOOL_IDS = [t["id"] for t in TOOLS]
TOOL_DIRS = {t["id"]: t["dir"] for t in TOOLS}

# results.json status -> our verdict
STATUS_VERDICT = {
    "no_bugs": "safe",
    "bugs_found": "vulnerable",
    "error": "error",
    "timeout": "timeout",
}


def load_json(path: Path):
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError:
        return None


def details_for_tool(tool_id: str, parsed: dict | None, results: dict | None) -> dict:
    """Pull a small, display-friendly details object."""
    out = {}
    if results and "execution_time" in results:
        out["execution_time_s"] = results["execution_time"]
    if not parsed:
        return out
    if tool_id == "picus":
        if parsed.get("counterexample"):
            out["counterexample"] = True
        if parsed.get("signals_with_multiple_values"):
            out["signals_with_multiple_values"] = len(
                parsed["signals_with_multiple_values"]
            )
    elif tool_id == "civer":
        stats = parsed.get("stats") or {}
        out.update(
            {
                k: stats[k]
                for k in ("verified", "failed", "timeout")
                if k in stats
            }
        )
    elif tool_id == "ecne":
        if parsed.get("constraint_status"):
            out["constraint_status"] = parsed["constraint_status"]
    elif tool_id == "circomspect":
        stats = parsed.get("statistics") or {}
        out.update({k: stats[k] for k in stats if k != "total_issues" or stats[k]})
        if stats.get("total_issues"):
            out["total_issues"] = stats["total_issues"]
    elif tool_id == "zkfuzz":
        if parsed.get("vulnerability"):
            out["vulnerability"] = parsed["vulnerability"]
    return out


# Regex patterns for error categorization in raw.txt. First match wins.
# All patterns are simple substrings or character-class scans to avoid
# catastrophic backtracking on large progress logs (zkfuzz raw.txt can be a
# single multi-MB line of carriage-returned progress updates).
ERROR_PATTERNS = [
    ("Pragma version mismatch (P1003)", re.compile(r"P1003")),
    ("File or template not found (P1014)", re.compile(r"P1014")),
    ("Rust panic", re.compile(r"panicked at")),
    ("Stack overflow / recursion limit", re.compile(r"stack overflow|RecursionError|recursion limit", re.I)),
    ("OOM / killed", re.compile(r"\bKilled\b|out of memory|OOM")),
    ("Timed out", re.compile(r"Timed out", re.I)),
    ("Compilation failed", re.compile(r"compilation failed", re.I)),
    ("circom error reported", re.compile(r"previous errors were found")),
    ("Disk full", re.compile(r"No space left on device")),
]


def tail_for_scan(text: str, max_chars: int = 64_000) -> str:
    """Return the last `max_chars` characters of `text`. Verdicts always
    sit near the end of raw.txt; scanning the tail keeps regex linear on
    pathological progress logs."""
    if len(text) <= max_chars:
        return text
    return text[-max_chars:]

# Section markers we never want to emit as a "pattern".
SECTION_MARKERS = re.compile(
    r"^\s*(stdout|stderr|partial stdout|partial stderr|exit code)\s*:?\s*$", re.I
)


def classify_error(raw_text: str) -> str:
    for label, regex in ERROR_PATTERNS:
        if regex.search(raw_text):
            return label
    # Fallback: scan for the first line that looks like a real diagnostic.
    for line in raw_text.splitlines():
        stripped = line.strip()
        if not stripped or SECTION_MARKERS.match(stripped):
            continue
        lower = stripped.lower()
        if (
            lower.startswith(("error", "fatal", "panic", "warning"))
            or "error:" in lower
            or "fatal:" in lower
        ):
            return stripped[:120]
    return "Other / uncategorized"


def build_path_to_id_map() -> dict[str, str]:
    """Map zkhydra bug-dir name (lowercased) -> website bug Id."""
    if not WEBSITE_BUGS.is_file():
        return {}
    bugs = json.loads(WEBSITE_BUGS.read_text())
    out = {}
    for b in bugs:
        bug_id = b.get("Id")
        if not bug_id:
            continue
        # Primary key: leaf of Path (e.g. .../veridise_missing_range_checks_in_bigmod).
        path = (b.get("Path") or "").rstrip("/")
        if path:
            out.setdefault(path.split("/")[-1].lower(), bug_id)
        # Fallback for bugs without a Path: leaf of Id.
        out.setdefault(bug_id.rstrip("/").split("/")[-1].lower(), bug_id)
    return out


TIMED_OUT_RE = re.compile(r"^\s*\[?\s*Timed out\s*\]?", re.I | re.MULTILINE)
ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")


def strip_ansi(text: str) -> str:
    return ANSI_RE.sub("", text)


def detect_error_or_timeout(raw_text: str) -> tuple[str | None, str | None]:
    text = tail_for_scan(raw_text)
    if TIMED_OUT_RE.search(text) or "[Timed out]" in raw_text[:64]:
        return "timeout", "Hit the global tool timeout"
    for label, regex in ERROR_PATTERNS:
        if regex.search(text):
            if label == "Timed out":
                return "timeout", "Hit the global tool timeout"
            return "error", label
    return None, None


# ---------------- Per-tool raw.txt parsers ----------------
#
# Each parser returns (verdict, details_dict). Verdict is one of
# safe / vulnerable / error / timeout / unknown. Details may carry
# tool-specific extras (counterexample present, failed components, etc).


PICUS_EXIT_RE = re.compile(r"Exiting Picus with the code (\d+)")


def parse_picus(raw: str) -> tuple[str, dict]:
    text = strip_ansi(tail_for_scan(raw))
    early_verdict, early_reason = detect_error_or_timeout(text)
    if early_verdict:
        return early_verdict, {"reason": early_reason}

    code_match = PICUS_EXIT_RE.search(text)
    code = int(code_match.group(1)) if code_match else None
    details: dict = {}
    if code is not None:
        details["exit_code"] = code

    underconstrained = "The circuit is underconstrained" in text
    properly = "is properly constrained" in text
    cannot_determine = "Cannot determine whether the circuit is properly constrained" in text
    has_counterexample = "Counterexample:" in text

    if has_counterexample or underconstrained or code == 9:
        if has_counterexample:
            details["counterexample"] = True
        return "vulnerable", details
    if code == 8 or properly:
        return "safe", details
    if code == 0 and cannot_determine:
        details["reason"] = "Picus could not determine soundness"
        return "unknown", details
    if code in (1, 50):
        details["reason"] = f"Picus exited with code {code}"
        return "error", details
    return "unknown", details


def parse_civer(raw: str) -> tuple[str, dict]:
    text = strip_ansi(tail_for_scan(raw))
    early_verdict, early_reason = detect_error_or_timeout(text)
    if early_verdict:
        return early_verdict, {"reason": early_reason}

    failed_match = re.search(
        r"Number of failed components \(weak-safety\):\s*(\d+)", text
    )
    verified_match = re.search(
        r"Number of verified components \(weak-safety\):\s*(\d+)", text
    )
    timeout_components_match = re.search(
        r"Number of timeout components \(weak-safety\):\s*(\d+)", text
    )
    failed_count = int(failed_match.group(1)) if failed_match else 0
    verified_count = int(verified_match.group(1)) if verified_match else 0
    timeout_components = (
        int(timeout_components_match.group(1)) if timeout_components_match else 0
    )

    details: dict = {}
    if verified_match:
        details["verified"] = verified_count
    if failed_match:
        details["failed"] = failed_count
    if timeout_components_match:
        details["timeout_components"] = timeout_components

    has_could_not_verify = "could not verify weak safety" in text
    has_safe_marker = "circom safe" in text or "Everything went okay" in text

    if failed_count > 0 or has_could_not_verify:
        return "vulnerable", details
    if has_safe_marker:
        return "safe", details
    if "previous errors were found" in text:
        return "error", {"reason": "Civer reported a circom error"}
    # Civer printed a circom-style call trace but never reached a verdict
    # block. Treat as error since the tool ended without classifying.
    if "= call trace:" in text or "found here" in text:
        return "error", {"reason": "Civer aborted without a verdict"}
    # Civer parsed templates and exited silently with no verification at all.
    if "template instances:" in text:
        return "error", {"reason": "Civer parsed templates but never verified"}
    # Output was empty or trivial.
    if len(text.strip()) < 200:
        return "error", {"reason": "Civer produced no usable output"}
    return "unknown", details


def parse_ecne(raw: str) -> tuple[str, dict]:
    text = strip_ansi(tail_for_scan(raw))
    early_verdict, early_reason = detect_error_or_timeout(text)
    if early_verdict:
        return early_verdict, {"reason": early_reason}

    bad_marker = "------ Bad Constraints ------"
    sound_marker = "has sound constraints"
    unsound_marker = "potentially unsound constraints"
    bad_idx = text.find(bad_marker)
    bad_constraints_count = 0
    if bad_idx != -1:
        # Count "constraint #" occurrences after the marker.
        bad_constraints_count = len(
            re.findall(r"constraint #\d+", text[bad_idx + len(bad_marker):])
        )

    details: dict = {}
    if bad_constraints_count:
        details["bad_constraints"] = bad_constraints_count

    # "potentially unsound constraints" is Ecne's text verdict that the
    # circuit is under-constrained even when the Bad Constraints listing is
    # missing (truncated logs, large circuits).
    if bad_constraints_count > 0 or unsound_marker in text:
        return "vulnerable", details
    if sound_marker in text:
        return "safe", details
    if "previous errors were found" in text:
        return "error", {"reason": "Ecne reported a circom error"}
    # Ecne ran (we see progress markers) but produced no verdict — the
    # runner killed it mid-analysis.
    if "Reading Constraints" in text or "Mode 1:" in text or "setup solver" in text:
        return "timeout", {"reason": "Ecne killed before producing a verdict"}
    # Ecne aborted on a circom constant during input parsing.
    if "= call trace:" in text or "found here" in text:
        return "error", {"reason": "Ecne aborted during input parsing"}
    return "unknown", details


def parse_circomspect(raw: str) -> tuple[str, dict]:
    text = strip_ansi(tail_for_scan(raw))
    early_verdict, early_reason = detect_error_or_timeout(text)
    if early_verdict:
        return early_verdict, {"reason": early_reason}

    if "circomspect: No issues found" in text:
        return "safe", {}

    warnings = len(re.findall(r"warning\[\w+\]", text))
    notes = len(re.findall(r"note\[\w+\]", text))
    errors = len(re.findall(r"error\[\w+\]", text))

    details: dict = {}
    if warnings:
        details["warnings"] = warnings
    if notes:
        details["notes"] = notes
    if errors:
        details["errors"] = errors

    if errors > 0 and warnings == 0 and notes == 0:
        details["reason"] = "Circomspect reported circom errors"
        return "error", details
    if warnings > 0 or notes > 0:
        return "vulnerable", details
    return "unknown", details


def parse_zkfuzz(raw: str) -> tuple[str, dict]:
    text = strip_ansi(tail_for_scan(raw))
    early_verdict, early_reason = detect_error_or_timeout(text)
    if early_verdict:
        return early_verdict, {"reason": early_reason}

    # Order matters: "Counter Example Found" is a substring of
    # "No Counter Example Found", so check the safe case first.
    if "No Counter Example Found" in text:
        return "safe", {}
    if (
        "Counter Example Found" in text
        or "Counter Example:" in text
        or "NOT SAFE" in text
    ):
        return "vulnerable", {"counterexample": True}
    if "panicked" in text or "previous errors were found" in text:
        return "error", {"reason": "zkFuzz crashed before reporting"}
    # zkFuzz reached its banner but never produced a verdict — runner
    # killed it during parsing or scanning.
    if (
        "Scanning TCCT Instances" in text
        or "Gathering Trace/Side Constraints" in text
        or "Loading Whitelists" in text
        or "Welcome to the zkFuzz" in text
    ):
        return "timeout", {"reason": "zkFuzz did not finish (likely killed)"}
    return "unknown", {}


PARSERS = {
    "picus": parse_picus,
    "civer": parse_civer,
    "ecne": parse_ecne,
    "circomspect": parse_circomspect,
    "zkfuzz": parse_zkfuzz,
}


def process_bug(bug_dir: Path, mode: str, path_to_id: dict[str, str]) -> dict | None:
    gt = load_json(bug_dir / "ground_truth.json")
    if gt is None:
        return None
    bug_dir_name = bug_dir.name
    website_bug_id = path_to_id.get(bug_dir_name.lower())

    tools = {}
    for tool_id in TOOL_IDS:
        tool_dir = bug_dir / TOOL_DIRS[tool_id]
        if not tool_dir.is_dir():
            tools[tool_id] = {
                "verdict": "missing",
                "details": {"reason": "Tool not run"},
            }
            continue

        raw_path = tool_dir / "raw.txt"
        raw_text = raw_path.read_text(errors="ignore") if raw_path.is_file() else ""

        if not raw_text.strip():
            tools[tool_id] = {
                "verdict": "missing",
                "details": {"reason": "No output recorded"},
            }
            continue

        parser = PARSERS.get(tool_id)
        verdict, details = parser(raw_text) if parser else ("unknown", {})

        # Add execution time when results.json exposes it (cheap, useful display).
        results = load_json(tool_dir / "results.json")
        if results and "execution_time" in results:
            details["execution_time_s"] = results["execution_time"]

        evaluation = load_json(tool_dir / "evaluation.json")
        if evaluation and evaluation.get("status"):
            details["ground_truth_match"] = evaluation["status"]

        tools[tool_id] = (
            {"verdict": verdict, "details": details}
            if details
            else {"verdict": verdict}
        )

    return {
        "id": bug_dir_name,
        "website_bug_id": website_bug_id,
        "title": gt.get("bug_name") or bug_dir_name,
        "ground_truth": {
            "vulnerability": gt.get("vulnerability"),
            "root_cause": gt.get("root_cause"),
            "impact": gt.get("impact"),
            "reproduced": gt.get("reproduced"),
            "compiled_direct": gt.get("compiled_direct"),
            "compiled_original": gt.get("compiled_original"),
            "project": gt.get("project"),
        },
        "tools": tools,
    }


def aggregate_mode(bugs: list[dict], mode_dir: Path) -> dict:
    summary = {tool: Counter() for tool in TOOL_IDS}
    error_patterns = {tool: Counter() for tool in TOOL_IDS}
    for bug in bugs:
        for tool_id in TOOL_IDS:
            verdict = bug["tools"][tool_id]["verdict"]
            summary[tool_id][verdict] += 1
            if verdict in {"error", "timeout"}:
                raw = mode_dir / bug["id"] / TOOL_DIRS[tool_id] / "raw.txt"
                if raw.is_file():
                    error_patterns[tool_id][classify_error(raw.read_text(errors="ignore"))] += 1
    return {
        "total_bugs": len(bugs),
        "summary": {
            tool: {k: summary[tool].get(k, 0) for k in
                   ("safe", "vulnerable", "error", "timeout", "unknown", "missing")}
            for tool in TOOL_IDS
        },
        "errors": {
            tool: [{"pattern": p, "count": c} for p, c in error_patterns[tool].most_common()]
            for tool in TOOL_IDS
        },
        "bugs": bugs,
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__, file=sys.stderr)
        return 2
    src = Path(argv[1]).resolve()
    if not src.is_dir():
        print(f"error: {src} is not a directory", file=sys.stderr)
        return 2

    summary_json = load_json(src / "summary.json") or {}
    path_to_id = build_path_to_id_map()

    summary_path = src / "summary.json"
    run_timestamp = (
        datetime.fromtimestamp(summary_path.stat().st_mtime, tz=timezone.utc)
        .isoformat(timespec="seconds")
        if summary_path.is_file()
        else None
    )

    out = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "run_timestamp": run_timestamp,
        "timeout_seconds": 300,
        "source": {
            "repo": "https://github.com/zksecurity/zkhydra",
            "snapshot_summary": summary_json,
        },
        "tools": TOOLS,
        "modes": {},
    }

    for mode in ("direct", "original"):
        mode_dir = src / mode
        if not mode_dir.is_dir():
            print(f"warn: {mode_dir} missing, skipping mode")
            continue
        bugs = []
        for bug_dir in sorted(p for p in mode_dir.iterdir() if p.is_dir()):
            entry = process_bug(bug_dir, mode, path_to_id)
            if entry:
                bugs.append(entry)
        out["modes"][mode] = aggregate_mode(bugs, mode_dir)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(out, indent=2) + "\n")
    print(f"wrote {OUT_JSON}")

    OUT_PDFS_DIR.mkdir(parents=True, exist_ok=True)
    for label in ("both", "direct", "original"):
        pdf = src / f"report.{label}.pdf"
        if pdf.is_file():
            shutil.copy2(pdf, OUT_PDFS_DIR / f"{label}.pdf")
            print(f"copied {pdf.name} -> {OUT_PDFS_DIR / f'{label}.pdf'}")

    matched = sum(1 for m in out["modes"].values() for b in m["bugs"] if b["website_bug_id"])
    total = sum(len(m["bugs"]) for m in out["modes"].values())
    print(f"resolved website_bug_id for {matched}/{total} bug entries")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
