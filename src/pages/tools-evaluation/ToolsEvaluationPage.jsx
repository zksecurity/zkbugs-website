import { Fragment, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ExpandMore, GitHub, OpenInNew, PictureAsPdf } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { DataGrid } from "@mui/x-data-grid";
import Container from "../../components/layout/Container";
import { useToolsEvaluation } from "../../hooks/useToolsEvaluation";
import { bugPath } from "../../utils/paths";

// Verdict semantics in this page are detection-correctness, not raw output:
//   vulnerable -> tool correctly flagged the bug (green)
//   safe       -> false negative (red)
//   error/timeout -> tool failed to produce a verdict (yellow)
//   missing/unknown -> no result (grey)
// Every bug in this dataset is a real bug, so a "vulnerable" verdict is the
// good outcome and a "safe" verdict is the bad one.

const VERDICT_ORDER = [
  "vulnerable",
  "safe",
  "error",
  "timeout",
  "unknown",
  "missing",
];

const VERDICT_LABEL = {
  vulnerable: "Detected (TP)",
  safe: "Missed (FN)",
  error: "Error",
  timeout: "Timeout",
  unknown: "Unknown",
  missing: "Not run",
};

const VERDICT_SHORT = {
  vulnerable: "Detected",
  safe: "Missed",
  error: "Error",
  timeout: "Timeout",
  unknown: "Unknown",
  missing: "Not run",
};

const verdictThemeColor = (theme, verdict) => {
  switch (verdict) {
    case "vulnerable":
      return theme.palette.success.main;
    case "safe":
      return theme.palette.error.main;
    case "error":
    case "timeout":
      return theme.palette.warning.main;
    case "unknown":
      return theme.palette.grey[500];
    default:
      return theme.palette.action.disabled;
  }
};

const verdictChipColor = (verdict) => {
  switch (verdict) {
    case "vulnerable":
      return "success";
    case "safe":
      return "error";
    case "error":
    case "timeout":
      return "warning";
    default:
      return "default";
  }
};

const PageWrapperStyled = styled("div")({ margin: "3rem 0 4rem" });

const PageHeaderStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "1.5rem",
  flexWrap: "wrap",
});

const SectionStyled = styled("section")({
  marginTop: "2.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  "& .section-title": { fontWeight: 600 },
});

const CardStyled = styled(Paper)(({ theme }) => ({
  padding: "1.25rem 1.5rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
}));

const KpiGridStyled = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "1rem",
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "repeat(2, 1fr)" },
}));

const KpiCardStyled = styled(Paper)(({ theme }) => ({
  padding: "1rem 1.25rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  "& .kpi-label": {
    fontSize: "0.78rem",
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  "& .kpi-value": { fontSize: "1.6rem", fontWeight: 600 },
  "& .kpi-sub": { fontSize: "0.85rem", color: theme.palette.text.secondary },
}));

const ToolsGridStyled = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "0.75rem",
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" },
}));

const ToolCardStyled = styled(Paper)(({ theme }) => ({
  padding: "1rem 1.25rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.45rem",
  "& .tool-name": { fontWeight: 600, fontSize: "1rem" },
  "& .tool-kind": {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  "& .tool-desc": { fontSize: "0.88rem", color: theme.palette.text.secondary },
}));

const FilterRowStyled = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "100px 1fr",
  alignItems: "center",
  columnGap: "0.75rem",
  rowGap: "0.5rem",
  "& .filter-label": {
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  "& .chip-row": { display: "flex", flexWrap: "wrap", gap: "0.35rem" },
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" },
}));

const ChartsRowStyled = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "1fr" },
}));

const DataGridStyled = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders [role=row]": {
    backgroundColor: theme.palette.background.paper,
    "& .MuiDataGrid-columnHeaderTitle": {
      textTransform: "uppercase",
      color: theme.palette.text.secondary,
      fontSize: "0.78rem",
    },
  },
  "& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-cell.wrap-cell": {
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    lineHeight: 1.35,
    paddingTop: "8px",
    paddingBottom: "8px",
    alignItems: "center",
    display: "flex",
  },
}));

const formatPercent = (n, d) =>
  d > 0 ? `${((100 * n) / d).toFixed(1)}%` : "—";

function VerdictChip({ verdict, details, prefix }) {
  if (!verdict) return null;
  const parts = [VERDICT_LABEL[verdict] ?? verdict];
  if (details) {
    Object.entries(details).forEach(([k, v]) => parts.push(`${k}: ${v}`));
  }
  const tooltip = parts.join("\n");
  const label = prefix
    ? `${prefix} ${VERDICT_SHORT[verdict] ?? verdict}`
    : VERDICT_SHORT[verdict] ?? verdict;
  return (
    <Tooltip title={<Box sx={{ whiteSpace: "pre-line" }}>{tooltip}</Box>}>
      <Chip
        size="small"
        label={label}
        color={verdictChipColor(verdict)}
        variant={
          verdict === "missing" || verdict === "unknown"
            ? "outlined"
            : "filled"
        }
        sx={{ minWidth: 92, fontSize: "0.72rem" }}
      />
    </Tooltip>
  );
}

VerdictChip.propTypes = {
  verdict: PropTypes.string,
  details: PropTypes.object,
  prefix: PropTypes.string,
};

function buildChartSeries(theme, tools, summary) {
  return VERDICT_ORDER.map((verdict) => ({
    label: VERDICT_LABEL[verdict],
    data: tools.map((t) => summary?.[t.id]?.[verdict] ?? 0),
    stack: "outcomes",
    color: verdictThemeColor(theme, verdict),
  })).filter((series) => series.data.some((v) => v > 0));
}

function totalsFor(tools, summary) {
  const acc = Object.fromEntries(VERDICT_ORDER.map((v) => [v, 0]));
  if (!summary) return acc;
  tools.forEach((t) => {
    const s = summary[t.id] ?? {};
    VERDICT_ORDER.forEach((v) => {
      acc[v] += s[v] ?? 0;
    });
  });
  return acc;
}

function detectionDistribution(bugs, tools) {
  // For each bug, count how many tools flagged it as vulnerable.
  const bucket = [0, 0, 0, 0, 0, 0]; // index = # tools (0..5)
  bugs.forEach((bug) => {
    const detected = tools.reduce((acc, tool) => {
      return bug.tools?.[tool.id]?.verdict === "vulnerable" ? acc + 1 : acc;
    }, 0);
    bucket[Math.min(detected, tools.length)] += 1;
  });
  return bucket;
}

function computeOverlap(modeObj, tools) {
  // Returns { perTool: { id -> {caught, unique, shared} },
  //           pairwise: { idA -> { idB -> intersection } },
  //           anyCaught, totalBugs }
  const perTool = Object.fromEntries(
    tools.map((t) => [t.id, { caughtSet: new Set(), unique: 0, shared: 0 }])
  );
  let anyCaught = 0;
  if (!modeObj?.bugs) {
    return {
      perTool: Object.fromEntries(
        tools.map((t) => [t.id, { caught: 0, unique: 0, shared: 0 }])
      ),
      pairwise: {},
      anyCaught: 0,
      totalBugs: 0,
    };
  }
  modeObj.bugs.forEach((bug) => {
    const detectors = tools.filter(
      (t) => bug.tools?.[t.id]?.verdict === "vulnerable"
    );
    if (detectors.length === 0) return;
    anyCaught += 1;
    detectors.forEach((t) => {
      perTool[t.id].caughtSet.add(bug.id);
      if (detectors.length === 1) perTool[t.id].unique += 1;
      else perTool[t.id].shared += 1;
    });
  });
  const pairwise = {};
  tools.forEach((a) => {
    pairwise[a.id] = {};
    tools.forEach((b) => {
      let count = 0;
      perTool[a.id].caughtSet.forEach((id) => {
        if (perTool[b.id].caughtSet.has(id)) count += 1;
      });
      pairwise[a.id][b.id] = count;
    });
  });
  const perToolPlain = Object.fromEntries(
    Object.entries(perTool).map(([id, v]) => [
      id,
      { caught: v.caughtSet.size, unique: v.unique, shared: v.shared },
    ])
  );
  return {
    perTool: perToolPlain,
    pairwise,
    anyCaught,
    totalBugs: modeObj.bugs.length,
  };
}

function ToolsEvaluationPage() {
  const theme = useTheme();
  const data = useToolsEvaluation();
  const [mode, setMode] = useState("direct");
  const [activeVulnerability, setActiveVulnerability] = useState("All");
  const [reproducedFilter, setReproducedFilter] = useState("All");

  const tools = useMemo(() => data?.tools ?? [], [data]);

  const directData = data?.modes?.direct ?? null;
  const originalData = data?.modes?.original ?? null;

  const vulnerabilities = useMemo(() => {
    if (!data?.modes) return ["All"];
    const set = new Set();
    Object.values(data.modes).forEach((m) =>
      m.bugs?.forEach((b) => {
        if (b.groundTruth?.vulnerability) set.add(b.groundTruth.vulnerability);
      })
    );
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  const bothBugs = useMemo(() => {
    if (!directData || !originalData) return [];
    const originalById = new Map(originalData.bugs.map((b) => [b.id, b]));
    return directData.bugs
      .filter((b) => originalById.has(b.id))
      .map((d) => ({
        ...d,
        directTools: d.tools,
        originalTools: originalById.get(d.id).tools,
      }));
  }, [directData, originalData]);

  const filteredSingle = useMemo(() => {
    const m =
      mode === "direct" ? directData : mode === "original" ? originalData : null;
    if (!m) return [];
    return m.bugs.filter((bug) => {
      if (
        activeVulnerability !== "All" &&
        bug.groundTruth?.vulnerability !== activeVulnerability
      ) {
        return false;
      }
      if (reproducedFilter !== "All") {
        const want = reproducedFilter === "Yes";
        if (Boolean(bug.groundTruth?.reproduced) !== want) return false;
      }
      return true;
    });
  }, [mode, directData, originalData, activeVulnerability, reproducedFilter]);

  const directOverlap = useMemo(
    () => computeOverlap(directData, tools),
    [directData, tools]
  );
  const originalOverlap = useMemo(
    () => computeOverlap(originalData, tools),
    [originalData, tools]
  );

  const filteredBoth = useMemo(() => {
    return bothBugs.filter((bug) => {
      if (
        activeVulnerability !== "All" &&
        bug.groundTruth?.vulnerability !== activeVulnerability
      ) {
        return false;
      }
      if (reproducedFilter !== "All") {
        const want = reproducedFilter === "Yes";
        if (Boolean(bug.groundTruth?.reproduced) !== want) return false;
      }
      return true;
    });
  }, [bothBugs, activeVulnerability, reproducedFilter]);

  const handleModeChange = (_event, next) => {
    if (next) setMode(next);
  };

  const generatedAt = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleString()
    : "unknown";
  const runTimestamp = data?.runTimestamp
    ? new Date(data.runTimestamp).toLocaleString()
    : null;
  const timeoutSeconds = data?.timeoutSeconds ?? 300;

  // Highlights — single-mode view: detection coverage by # of tools.
  const singleHighlightBugs =
    mode === "direct"
      ? directData?.bugs ?? []
      : mode === "original"
      ? originalData?.bugs ?? []
      : [];
  const singleHighlightDist = detectionDistribution(singleHighlightBugs, tools);
  const singleHighlightTotal = singleHighlightBugs.length;
  const detectedAtLeastOne = singleHighlightTotal - singleHighlightDist[0];
  const detectedAtLeastTwo =
    singleHighlightDist[2] +
    singleHighlightDist[3] +
    singleHighlightDist[4] +
    singleHighlightDist[5];
  const detectedAtLeastThree =
    singleHighlightDist[3] + singleHighlightDist[4] + singleHighlightDist[5];
  const undetected = singleHighlightDist[0];

  // Highlights — both-mode view: per-bug delta direct vs original.
  const detectedInMode = (toolsForMode) =>
    tools.some((t) => toolsForMode?.[t.id]?.verdict === "vulnerable");

  const bothDelta = bothBugs.reduce(
    (acc, bug) => {
      const inDirect = detectedInMode(bug.directTools);
      const inOriginal = detectedInMode(bug.originalTools);
      if (inDirect && inOriginal) acc.both += 1;
      else if (inDirect) acc.directOnly += 1;
      else if (inOriginal) acc.originalOnly += 1;
      else acc.neither += 1;
      return acc;
    },
    { both: 0, directOnly: 0, originalOnly: 0, neither: 0 }
  );
  const bothTotal = bothBugs.length;

  // Summary helpers per mode.
  const renderSingleMode = (modeName, modeObj) => {
    const totals = totalsFor(tools, modeObj.summary);
    const totalRuns = modeObj.totalBugs * tools.length;
    const usable = totals.vulnerable + totals.safe;
    return { totals, totalRuns, usable };
  };

  const directStats = directData ? renderSingleMode("direct", directData) : null;
  const originalStats = originalData
    ? renderSingleMode("original", originalData)
    : null;
  const activeStats =
    mode === "direct" ? directStats : mode === "original" ? originalStats : null;

  // -------------------- Render helpers --------------------

  const renderKpis = () => {
    if (mode === "both") {
      const items = [
        {
          label: "Bugs in both modes",
          value: bothBugs.length,
          sub: `${directData.totalBugs} direct · ${originalData.totalBugs} original`,
        },
        {
          label: "Direct detection rate",
          value: formatPercent(
            directStats.totals.vulnerable,
            directStats.usable
          ),
          sub: `${directStats.totals.vulnerable} of ${directStats.usable} usable runs`,
        },
        {
          label: "Original detection rate",
          value: formatPercent(
            originalStats.totals.vulnerable,
            originalStats.usable
          ),
          sub: `${originalStats.totals.vulnerable} of ${originalStats.usable} usable runs`,
        },
        {
          label: "Tool runs",
          value: directStats.totalRuns + originalStats.totalRuns,
          sub: `${tools.length} tools × ${directData.totalBugs + originalData.totalBugs} bugs`,
        },
      ];
      return items;
    }
    const stats = activeStats;
    return [
      {
        label: "Bugs evaluated",
        value: mode === "direct" ? directData.totalBugs : originalData.totalBugs,
        sub: "Circom bugs in this mode",
      },
      {
        label: "Tool runs",
        value: stats.totalRuns,
        sub: `${tools.length} tools × bugs`,
      },
      {
        label: "Usable verdicts",
        value: formatPercent(stats.usable, stats.totalRuns),
        sub: `${stats.usable} of ${stats.totalRuns} runs returned a verdict`,
      },
      {
        label: "Detection rate",
        value: formatPercent(stats.totals.vulnerable, stats.usable),
        sub: `${stats.totals.vulnerable} of usable runs caught the bug`,
      },
    ];
  };

  const renderOverlap = (modeObj, overlap, title) => {
    const orderedTools = tools
      .slice()
      .sort((a, b) => overlap.perTool[b.id].caught - overlap.perTool[a.id].caught);
    const uniqueColor = theme.palette.success.main;
    const sharedColor =
      theme.palette.mode === "dark"
        ? "rgba(102, 187, 106, 0.55)"
        : "rgba(46, 125, 50, 0.45)";
    const series = [
      {
        label: "Unique to this tool",
        data: orderedTools.map((t) => overlap.perTool[t.id].unique),
        stack: "overlap",
        color: uniqueColor,
      },
      {
        label: "Shared with at least one other",
        data: orderedTools.map((t) => overlap.perTool[t.id].shared),
        stack: "overlap",
        color: sharedColor,
      },
    ];

    const maxPair = Math.max(
      1,
      ...tools.flatMap((a) =>
        tools.map((b) => (a.id === b.id ? 0 : overlap.pairwise[a.id][b.id]))
      )
    );

    const cellBackground = (count, isDiagonal) => {
      if (isDiagonal) {
        return theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.04)"
          : "rgba(0,0,0,0.03)";
      }
      if (count === 0) return "transparent";
      const intensity = count / maxPair;
      if (theme.palette.mode === "dark") {
        return `rgba(102, 187, 106, ${0.18 + 0.45 * intensity})`;
      }
      return `rgba(46, 125, 50, ${0.12 + 0.45 * intensity})`;
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {title && (
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary" }}
          >
            {title}
          </Typography>
        )}
        <CardStyled elevation={0}>
          <Typography
            variant="subtitle2"
            sx={{ marginBottom: "0.5rem", fontWeight: 600 }}
          >
            Unique vs shared detections
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: "0.75rem", lineHeight: 1.5 }}
          >
            For each tool: how many bugs only this tool flagged (top segment)
            vs how many it flagged together with at least one other tool
            (lighter segment). Sorted by total catches.
          </Typography>
          <BarChart
            xAxis={[{ data: orderedTools.map((t) => t.name), scaleType: "band" }]}
            series={series}
            height={300}
            margin={{ top: 24, right: 220, bottom: 50, left: 56 }}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                itemMarkWidth: 14,
                itemMarkHeight: 14,
                itemGap: 8,
                labelStyle: { fontSize: 13 },
              },
            }}
          />
        </CardStyled>
        <CardStyled elevation={0}>
          <Typography
            variant="subtitle2"
            sx={{ marginBottom: "0.5rem", fontWeight: 600 }}
          >
            Pairwise overlap (bugs both tools flagged)
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: "0.75rem", lineHeight: 1.5 }}
          >
            Each cell shows the number of bugs that the row tool and the
            column tool both flagged as vulnerable. The diagonal is each
            tool&apos;s total catches. Darker cells mean more agreement.
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `minmax(110px, max-content) repeat(${tools.length}, minmax(72px, 1fr))`,
                rowGap: "2px",
                columnGap: "2px",
                fontSize: "0.85rem",
                minWidth: "max-content",
              }}
            >
              <div />
              {tools.map((t) => (
                <Box
                  key={`h-${t.id}`}
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    textAlign: "center",
                    padding: "6px 4px",
                    fontSize: "0.78rem",
                  }}
                >
                  {t.name}
                </Box>
              ))}
              {tools.map((rowTool) => (
                <Fragment key={`r-${rowTool.id}`}>
                  <Box
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      padding: "6px 8px",
                      whiteSpace: "nowrap",
                      fontSize: "0.78rem",
                    }}
                  >
                    {rowTool.name}
                  </Box>
                  {tools.map((colTool) => {
                    const value = overlap.pairwise[rowTool.id][colTool.id];
                    const isDiagonal = rowTool.id === colTool.id;
                    return (
                      <Tooltip
                        key={`c-${rowTool.id}-${colTool.id}`}
                        title={
                          isDiagonal
                            ? `${rowTool.name} caught ${value} bugs total`
                            : `${rowTool.name} ∩ ${colTool.name}: ${value}`
                        }
                      >
                        <Box
                          sx={{
                            backgroundColor: cellBackground(value, isDiagonal),
                            padding: "8px 4px",
                            textAlign: "center",
                            fontWeight: isDiagonal ? 700 : 500,
                            color: isDiagonal
                              ? "text.secondary"
                              : "text.primary",
                            borderRadius: "4px",
                          }}
                        >
                          {value}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Fragment>
              ))}
            </Box>
          </Box>
          {overlap.anyCaught > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", marginTop: "0.75rem" }}
            >
              {overlap.anyCaught} of {overlap.totalBugs} bugs were caught by at
              least one tool. Tools with high unique counts add coverage the
              others miss.
            </Typography>
          )}
        </CardStyled>
      </Box>
    );
  };

  const renderChart = (modeObj, title) => {
    const series = buildChartSeries(theme, tools, modeObj.summary);
    return (
      <CardStyled elevation={0}>
        {title && (
          <Typography
            variant="subtitle2"
            sx={{ marginBottom: "0.5rem", color: "text.secondary" }}
          >
            {title}
          </Typography>
        )}
        <BarChart
          xAxis={[{ data: tools.map((t) => t.name), scaleType: "band" }]}
          series={series}
          height={320}
          margin={{ top: 24, right: 200, bottom: 50, left: 56 }}
          slotProps={{
            legend: {
              direction: "column",
              position: { vertical: "middle", horizontal: "right" },
              itemMarkWidth: 14,
              itemMarkHeight: 14,
              itemGap: 8,
              labelStyle: { fontSize: 13 },
            },
          }}
        />
      </CardStyled>
    );
  };

  // -------------------- Table columns --------------------

  const baseColumns = useMemo(() => [
    {
      field: "title",
      headerName: "Bug",
      width: 360,
      cellClassName: "wrap-cell",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
            width: "100%",
            minWidth: 0,
          }}
        >
          {params.row.websiteBugId ? (
            <RouterLink
              to={bugPath(params.row.websiteBugId)}
              style={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                textDecoration: "none",
                wordBreak: "break-word",
              }}
            >
              {params.row.title}
            </RouterLink>
          ) : (
            <span style={{ fontWeight: 600, wordBreak: "break-word" }}>
              {params.row.title}
            </span>
          )}
          <span
            style={{
              fontSize: "0.72rem",
              color: theme.palette.text.secondary,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {params.row.id}
          </span>
        </Box>
      ),
    },
    {
      field: "vulnerability",
      headerName: "Vulnerability",
      width: 160,
      cellClassName: "wrap-cell",
      renderCell: (params) =>
        params.row.vulnerability ? (
          <Chip
            size="small"
            label={params.row.vulnerability}
            variant="outlined"
            sx={{
              maxWidth: "100%",
              height: "auto",
              "& .MuiChip-label": {
                whiteSpace: "normal",
                lineHeight: 1.3,
                paddingTop: "3px",
                paddingBottom: "3px",
              },
            }}
          />
        ) : null,
    },
    {
      field: "rootCause",
      headerName: "Root Cause",
      width: 180,
      cellClassName: "wrap-cell",
      renderCell: (params) =>
        params.row.rootCause ? (
          <Chip
            size="small"
            label={params.row.rootCause}
            variant="outlined"
            sx={{
              maxWidth: "100%",
              height: "auto",
              "& .MuiChip-label": {
                whiteSpace: "normal",
                lineHeight: 1.3,
                paddingTop: "3px",
                paddingBottom: "3px",
              },
            }}
          />
        ) : null,
    },
  ], [theme]);

  const singleToolColumns = useMemo(
    () =>
      tools.map((tool) => ({
        field: `verdict_${tool.id}`,
        headerName: tool.name,
        width: 130,
        sortable: true,
        align: "center",
        headerAlign: "center",
        cellClassName: "wrap-cell",
        valueGetter: (_value, row) => row.verdicts?.[tool.id] ?? "missing",
        renderCell: (params) => (
          <VerdictChip
            verdict={params.row.verdicts?.[tool.id]}
            details={params.row.details?.[tool.id]}
          />
        ),
      })),
    [tools]
  );

  const bothToolColumns = useMemo(
    () =>
      tools.map((tool) => ({
        field: `verdict_${tool.id}`,
        headerName: tool.name,
        width: 170,
        sortable: false,
        align: "center",
        headerAlign: "center",
        cellClassName: "wrap-cell",
        renderCell: (params) => (
          <Stack
            direction="column"
            spacing={0.4}
            sx={{ alignItems: "center", padding: "4px 0" }}
          >
            <VerdictChip
              verdict={params.row.directVerdicts?.[tool.id]}
              details={params.row.directDetails?.[tool.id]}
              prefix="D"
            />
            <VerdictChip
              verdict={params.row.originalVerdicts?.[tool.id]}
              details={params.row.originalDetails?.[tool.id]}
              prefix="O"
            />
          </Stack>
        ),
      })),
    [tools]
  );

  const singleRows = useMemo(
    () =>
      filteredSingle.map((bug) => ({
        id: bug.id,
        title: bug.title,
        websiteBugId: bug.websiteBugId,
        vulnerability: bug.groundTruth?.vulnerability,
        rootCause: bug.groundTruth?.rootCause,
        verdicts: Object.fromEntries(
          tools.map((t) => [t.id, bug.tools?.[t.id]?.verdict ?? "missing"])
        ),
        details: Object.fromEntries(
          tools.map((t) => [t.id, bug.tools?.[t.id]?.details])
        ),
      })),
    [filteredSingle, tools]
  );

  const bothRows = useMemo(
    () =>
      filteredBoth.map((bug) => ({
        id: bug.id,
        title: bug.title,
        websiteBugId: bug.websiteBugId,
        vulnerability: bug.groundTruth?.vulnerability,
        rootCause: bug.groundTruth?.rootCause,
        directVerdicts: Object.fromEntries(
          tools.map((t) => [t.id, bug.directTools?.[t.id]?.verdict ?? "missing"])
        ),
        directDetails: Object.fromEntries(
          tools.map((t) => [t.id, bug.directTools?.[t.id]?.details])
        ),
        originalVerdicts: Object.fromEntries(
          tools.map((t) => [t.id, bug.originalTools?.[t.id]?.verdict ?? "missing"])
        ),
        originalDetails: Object.fromEntries(
          tools.map((t) => [t.id, bug.originalTools?.[t.id]?.details])
        ),
      })),
    [filteredBoth, tools]
  );

  const tableRows = mode === "both" ? bothRows : singleRows;
  const tableColumns = useMemo(
    () =>
      mode === "both"
        ? [...baseColumns, ...bothToolColumns]
        : [...baseColumns, ...singleToolColumns],
    [mode, baseColumns, singleToolColumns, bothToolColumns]
  );

  const totalForActive =
    mode === "both"
      ? bothBugs.length
      : mode === "direct"
      ? directData?.totalBugs ?? 0
      : originalData?.totalBugs ?? 0;

  const pdfHref = `/dataset/tools-evaluation/${mode}.pdf`;

  // -------------------- Render --------------------

  if (!data) {
    return (
      <Container>
        <PageWrapperStyled>
          <Typography>Loading evaluation…</Typography>
        </PageWrapperStyled>
      </Container>
    );
  }

  return (
    <Container>
      <PageWrapperStyled>
        <PageHeaderStyled>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Tools Evaluation
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginTop: "0.5rem", maxWidth: 760 }}
            >
              Five static, symbolic and fuzzing tools run across the Circom
              bugs in the dataset. Powered by{" "}
              <a
                href={data.source?.repo}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit" }}
              >
                zkhydra
              </a>
              .
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: "0.5rem" }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              size="small"
              color="secondary"
            >
              <ToggleButton value="direct">Direct</ToggleButton>
              <ToggleButton value="original">Original</ToggleButton>
              <ToggleButton value="both">Both</ToggleButton>
            </ToggleButtonGroup>
            {data.source?.repo && (
              <Tooltip title="Open the zkhydra repository on GitHub">
                <Button
                  component="a"
                  href={data.source.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<GitHub fontSize="small" />}
                >
                  zkhydra
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Open the raw zkhydra report PDF in a new tab">
              <Button
                component="a"
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<PictureAsPdf fontSize="small" />}
              >
                Raw report
              </Button>
            </Tooltip>
          </Stack>
        </PageHeaderStyled>

        {runTimestamp && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ marginTop: "0.5rem", display: "block" }}
          >
            Latest zkhydra run: {runTimestamp}
          </Typography>
        )}

        <SectionStyled>
          <Alert severity="warning" variant="outlined">
            <strong>TODO / Experimental.</strong> Results are early and depend
            on tool versions, parsers, and runner configuration that change
            frequently. Each tool run is capped at a {timeoutSeconds / 60}-minute
            ({timeoutSeconds}s) timeout. Runs that exceeded it land in the
            &quot;Timeout&quot; bucket. Treat counts as directional and expect
            them to shift between runs.
          </Alert>
        </SectionStyled>

        <SectionStyled>
          <Alert severity="info" variant="outlined">
            <strong>False positives are not measured here.</strong> Each bug in
            this dataset is a real bug, so a &quot;Detected&quot; verdict is
            only counted as a true positive. The page does not weigh how often
            each tool flags clean code as vulnerable. In practice{" "}
            <strong>Ecne</strong> and <strong>Circomspect</strong> tend to
            produce many false positives on real codebases, while{" "}
            <strong>Picus</strong>, <strong>Civer</strong>, and{" "}
            <strong>zkFuzz</strong> typically have far fewer. Take the
            detection counts here as one signal, not the whole picture.
          </Alert>
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Scope
          </Typography>
          <CardStyled elevation={0}>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              The evaluation currently covers <strong>Circom only</strong>. Each
              bug is exercised in two modes when both compile cleanly:
            </Typography>
            <Box
              component="ul"
              sx={{
                marginTop: "0.5rem",
                paddingLeft: "1.25rem",
                lineHeight: 1.6,
              }}
            >
              <li>
                <strong>Direct</strong> ({directData?.totalBugs ?? 0} bugs):
                each tool runs against an isolated wrapper
                (<code>circuit.circom</code>) that only instantiates the
                vulnerable template. Useful for comparing tools on a minimal,
                reproducible surface.
              </li>
              <li>
                <strong>Original</strong> ({originalData?.totalBugs ?? 0}{" "}
                bugs): each tool runs against the project&apos;s real
                entrypoint at the pinned commit. Closer to a real-world audit
                setting.
              </li>
              <li>
                <strong>Both</strong>: bugs that ran successfully in both modes
                ({bothBugs.length} bugs), aligned side by side for direct
                comparison.
              </li>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: "0.75rem", lineHeight: 1.6 }}
            >
              Every bug here is a real bug, so verdicts are colored by detection
              correctness:{" "}
              <Box component="span" sx={{ color: "success.main", fontWeight: 600 }}>
                Detected
              </Box>{" "}
              = true positive,{" "}
              <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
                Missed
              </Box>{" "}
              = false negative,{" "}
              <Box component="span" sx={{ color: "warning.main", fontWeight: 600 }}>
                Error / Timeout
              </Box>{" "}
              = no usable verdict.
            </Typography>
          </CardStyled>
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Tools
          </Typography>
          <ToolsGridStyled>
            {tools.map((tool) => (
              <ToolCardStyled key={tool.id} elevation={0}>
                <span className="tool-kind">{tool.kind}</span>
                <span className="tool-name">{tool.name}</span>
                <span className="tool-desc">{tool.description}</span>
                {tool.url && (
                  <Button
                    component="a"
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="text"
                    color="secondary"
                    size="small"
                    endIcon={<OpenInNew fontSize="small" />}
                    sx={{
                      alignSelf: "flex-start",
                      textTransform: "none",
                      padding: 0,
                      minHeight: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Repo
                  </Button>
                )}
              </ToolCardStyled>
            ))}
          </ToolsGridStyled>
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Highlights{" "}
            {mode === "both"
              ? "(direct vs original delta)"
              : `(${mode} mode)`}
          </Typography>
          <CardStyled elevation={0}>
            {mode === "both" ? (
              <>
                <KpiGridStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Caught in both modes</span>
                    <span
                      className="kpi-value"
                      style={{ color: theme.palette.success.main }}
                    >
                      {bothDelta.both}
                      <Box
                        component="span"
                        sx={{
                          fontSize: "1rem",
                          color: "text.secondary",
                          fontWeight: 400,
                          marginLeft: "0.4rem",
                        }}
                      >
                        / {bothTotal}
                      </Box>
                    </span>
                    <span className="kpi-sub">
                      {formatPercent(bothDelta.both, bothTotal)} detected
                      regardless of entrypoint
                    </span>
                  </KpiCardStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Direct only</span>
                    <span
                      className="kpi-value"
                      style={{ color: theme.palette.warning.main }}
                    >
                      {bothDelta.directOnly}
                    </span>
                    <span className="kpi-sub">
                      {formatPercent(bothDelta.directOnly, bothTotal)} caught by
                      direct wrapper, missed in original
                    </span>
                  </KpiCardStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Original only</span>
                    <span
                      className="kpi-value"
                      style={{ color: theme.palette.warning.main }}
                    >
                      {bothDelta.originalOnly}
                    </span>
                    <span className="kpi-sub">
                      {formatPercent(bothDelta.originalOnly, bothTotal)} caught
                      in original, missed by direct
                    </span>
                  </KpiCardStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Missed by both</span>
                    <span
                      className="kpi-value"
                      style={{ color: theme.palette.error.main }}
                    >
                      {bothDelta.neither}
                    </span>
                    <span className="kpi-sub">
                      {formatPercent(bothDelta.neither, bothTotal)} undetected
                      in either mode
                    </span>
                  </KpiCardStyled>
                </KpiGridStyled>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: "0.75rem", lineHeight: 1.5 }}
                >
                  A bug is &quot;caught&quot; in a mode when at least one of the
                  five tools flagged it as vulnerable in that mode. Numbers are
                  computed across the {bothTotal} bugs that ran in both
                  entrypoints.
                </Typography>
              </>
            ) : (
              <>
                <KpiGridStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Caught by ≥ 1 tool</span>
                    <span className="kpi-value">
                      {detectedAtLeastOne}
                      <Box
                        component="span"
                        sx={{
                          fontSize: "1rem",
                          color: "text.secondary",
                          fontWeight: 400,
                          marginLeft: "0.4rem",
                        }}
                      >
                        / {singleHighlightTotal}
                      </Box>
                    </span>
                    <span className="kpi-sub">
                      {formatPercent(detectedAtLeastOne, singleHighlightTotal)}{" "}
                      coverage
                    </span>
                  </KpiCardStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Caught by ≥ 2 tools</span>
                    <span className="kpi-value">{detectedAtLeastTwo}</span>
                    <span className="kpi-sub">
                      {formatPercent(detectedAtLeastTwo, singleHighlightTotal)}{" "}
                      of bugs
                    </span>
                  </KpiCardStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Caught by ≥ 3 tools</span>
                    <span className="kpi-value">{detectedAtLeastThree}</span>
                    <span className="kpi-sub">
                      {formatPercent(detectedAtLeastThree, singleHighlightTotal)}{" "}
                      of bugs
                    </span>
                  </KpiCardStyled>
                  <KpiCardStyled elevation={0}>
                    <span className="kpi-label">Missed by all tools</span>
                    <span
                      className="kpi-value"
                      style={{ color: theme.palette.error.main }}
                    >
                      {undetected}
                    </span>
                    <span className="kpi-sub">
                      {formatPercent(undetected, singleHighlightTotal)} fully
                      undetected
                    </span>
                  </KpiCardStyled>
                </KpiGridStyled>
                <Box
                  sx={{
                    marginTop: "0.75rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {singleHighlightDist.map((count, n) => (
                    <Chip
                      key={n}
                      label={`${count} bug${count === 1 ? "" : "s"} · ${n} tool${
                        n === 1 ? "" : "s"
                      }`}
                      size="small"
                      variant="outlined"
                      color={n === 0 ? "error" : "default"}
                    />
                  ))}
                </Box>
              </>
            )}
          </CardStyled>
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Run summary
          </Typography>
          <KpiGridStyled>
            {renderKpis().map((k) => (
              <KpiCardStyled key={k.label} elevation={0}>
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-value">{k.value}</span>
                <span className="kpi-sub">{k.sub}</span>
              </KpiCardStyled>
            ))}
          </KpiGridStyled>
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Outcomes per tool
          </Typography>
          {mode === "both" ? (
            <ChartsRowStyled>
              {renderChart(directData, "Direct mode")}
              {renderChart(originalData, "Original mode")}
            </ChartsRowStyled>
          ) : (
            renderChart(mode === "direct" ? directData : originalData)
          )}
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Tool detection overlap
          </Typography>
          {mode === "both" ? (
            <ChartsRowStyled>
              {renderOverlap(directData, directOverlap, "Direct mode")}
              {renderOverlap(originalData, originalOverlap, "Original mode")}
            </ChartsRowStyled>
          ) : mode === "direct" ? (
            renderOverlap(directData, directOverlap)
          ) : (
            renderOverlap(originalData, originalOverlap)
          )}
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Per-bug results
          </Typography>
          <CardStyled
            elevation={0}
            sx={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <FilterRowStyled>
              <span className="filter-label">Vulnerability</span>
              <div className="chip-row">
                {vulnerabilities.map((v) => (
                  <Chip
                    key={v}
                    label={v}
                    size="small"
                    clickable
                    color={activeVulnerability === v ? "secondary" : "default"}
                    variant={activeVulnerability === v ? "filled" : "outlined"}
                    onClick={() => setActiveVulnerability(v)}
                  />
                ))}
              </div>
            </FilterRowStyled>
            <FilterRowStyled>
              <span className="filter-label">Reproduced</span>
              <div className="chip-row">
                {["All", "Yes", "No"].map((v) => (
                  <Chip
                    key={v}
                    label={v}
                    size="small"
                    clickable
                    color={reproducedFilter === v ? "secondary" : "default"}
                    variant={reproducedFilter === v ? "filled" : "outlined"}
                    onClick={() => setReproducedFilter(v)}
                  />
                ))}
              </div>
            </FilterRowStyled>
            <Typography variant="body2" color="text.secondary">
              {tableRows.length === totalForActive
                ? `${totalForActive} bug${totalForActive === 1 ? "" : "s"}`
                : `${tableRows.length} of ${totalForActive} bug${
                    totalForActive === 1 ? "" : "s"
                  }`}
              {mode === "both" && (
                <>
                  {" "}
                  · Each tool cell shows{" "}
                  <strong style={{ color: theme.palette.text.primary }}>D</strong>{" "}
                  (Direct) above{" "}
                  <strong style={{ color: theme.palette.text.primary }}>O</strong>{" "}
                  (Original).
                </>
              )}
            </Typography>
            <Box sx={{ minHeight: 360 }}>
              <DataGridStyled
                rows={tableRows}
                columns={tableColumns}
                getRowHeight={() => "auto"}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
              />
            </Box>
          </CardStyled>
        </SectionStyled>

        {mode !== "both" && (
          <SectionStyled>
            <Typography variant="h6" className="section-title">
              Errors categorization
            </Typography>
            {tools.map((tool) => {
              const modeObj = mode === "direct" ? directData : originalData;
              const errs = modeObj.errors?.[tool.id] ?? [];
              const total = errs.reduce((acc, e) => acc + e.count, 0);
              return (
                <Accordion
                  key={tool.id}
                  disableGutters
                  disabled={errs.length === 0}
                  sx={{
                    border: `1px solid ${theme.palette.borders.default}`,
                    borderRadius: "0.5rem !important",
                    "&:before": { display: "none" },
                    marginBottom: "0.5rem",
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {tool.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginLeft: "auto" }}
                      >
                        {errs.length === 0
                          ? "No errors recorded"
                          : `${total} error${
                              total === 1 ? "" : "s"
                            } in ${errs.length} categor${
                              errs.length === 1 ? "y" : "ies"
                            }`}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  {errs.length > 0 && (
                    <AccordionDetails>
                      <Box
                        component="ul"
                        sx={{
                          margin: 0,
                          paddingLeft: 0,
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                        }}
                      >
                        {errs.map((e) => (
                          <Box
                            key={e.pattern}
                            component="li"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "0.35rem 0.5rem",
                              borderRadius: "0.25rem",
                              backgroundColor: theme.palette.background.default,
                            }}
                          >
                            <code
                              style={{
                                fontFamily: "Roboto Mono, monospace",
                                fontSize: "0.85rem",
                              }}
                            >
                              {e.pattern}
                            </code>
                            <Chip
                              size="small"
                              label={e.count}
                              color="warning"
                              variant="outlined"
                            />
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  )}
                </Accordion>
              );
            })}
          </SectionStyled>
        )}

        <SectionStyled>
          <Typography variant="caption" color="text.secondary">
            Generated {generatedAt}. Source data from{" "}
            <a
              href={data.source?.repo}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              zkhydra
            </a>
            .
          </Typography>
        </SectionStyled>
      </PageWrapperStyled>
    </Container>
  );
}

export default ToolsEvaluationPage;
