import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { tokenizeToLines as tokenizeCircom } from "../../utils/highlightCircom";
import { tokenizeToLines as tokenizeRust } from "../../utils/highlightRust";
import { tokenizeToLines as tokenizeGo } from "../../utils/highlightGo";
import { tokenizeToLines as tokenizeCairo } from "../../utils/highlightCairo";

const EXPAND_STEP = 25;

const TOKENIZERS = {
  circom: tokenizeCircom,
  rust: tokenizeRust,
  go: tokenizeGo,
  cairo: tokenizeCairo,
};

const TOKEN_COLORS = {
  dark: {
    keyword: "#c792ea",
    builtin: "#82aaff",
    constraint: "#f78c6c",
    operator: "#89ddff",
    punctuation: "#b0bec5",
    number: "#f78c6c",
    string: "#c3e88d",
    comment: "#7d8799",
    identifier: "#eeffff",
    text: "#eeffff",
  },
  light: {
    keyword: "#6f42c1",
    builtin: "#005cc5",
    constraint: "#d73a49",
    operator: "#005cc5",
    punctuation: "#24292e",
    number: "#005cc5",
    string: "#22863a",
    comment: "#6a737d",
    identifier: "#24292e",
    text: "#24292e",
  },
};

const WrapperStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "scheme",
})(({ theme, scheme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  fontFamily: "Roboto Mono, monospace",
  fontSize: "13px",
  lineHeight: "1.55",
  maxHeight: "560px",
  overflow: "auto",
  "& .tok-keyword": { color: scheme.keyword, fontWeight: 600 },
  "& .tok-builtin": { color: scheme.builtin },
  "& .tok-constraint": { color: scheme.constraint, fontWeight: 600 },
  "& .tok-operator": { color: scheme.operator },
  "& .tok-punctuation": { color: scheme.punctuation },
  "& .tok-number": { color: scheme.number },
  "& .tok-string": { color: scheme.string },
  "& .tok-comment": { color: scheme.comment, fontStyle: "italic" },
  "& .tok-identifier": { color: scheme.identifier },
  "& .tok-text": { color: scheme.text },
}));

const LineRowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  minWidth: "max-content",
  "&.highlight .line-number, &.highlight .line-content": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 200, 0, 0.12)"
        : "rgba(255, 235, 130, 0.5)",
  },
  "&.highlight .line-number": {
    borderLeft: `3px solid ${theme.palette.warning.main}`,
    paddingLeft: "9px",
  },
  "& .line-number": {
    flex: "0 0 56px",
    position: "sticky",
    left: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    textAlign: "right",
    paddingLeft: "12px",
    paddingRight: "12px",
    userSelect: "none",
    whiteSpace: "pre",
    borderRight: `1px solid ${theme.palette.borders.default}`,
  },
  "& .line-content": {
    flex: "1 0 auto",
    whiteSpace: "pre",
    paddingLeft: "12px",
    paddingRight: "24px",
  },
}));

const ExpandRowStyled = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.35rem",
  width: "100%",
  minWidth: "max-content",
  padding: "6px 12px",
  background: theme.palette.background.default,
  border: "none",
  borderTop: `1px solid ${theme.palette.borders.default}`,
  borderBottom: `1px solid ${theme.palette.borders.default}`,
  color: theme.palette.text.secondary,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "12px",
  position: "sticky",
  left: 0,
  "& svg": { fontSize: "16px" },
  "&:hover": {
    background: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  "&:disabled": {
    cursor: "default",
    opacity: 0.5,
  },
}));

const StatusBoxStyled = styled(Box)(({ theme }) => ({
  padding: "12px",
  border: `1px dashed ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

function CodeSnippet({
  url,
  startLine,
  endLine,
  contextLines = 12,
  language = "plain",
  className,
}) {
  const theme = useTheme();
  const scheme =
    theme.palette.mode === "light" ? TOKEN_COLORS.light : TOKEN_COLORS.dark;
  const [state, setState] = useState({ text: null, error: null, loading: true });
  const [expandAbove, setExpandAbove] = useState(0);
  const [expandBelow, setExpandBelow] = useState(0);

  useEffect(() => {
    setExpandAbove(0);
    setExpandBelow(0);
  }, [url, startLine, endLine]);

  useEffect(() => {
    let cancelled = false;
    setState({ text: null, error: null, loading: true });

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        if (!cancelled) {
          setState({ text, error: null, loading: false });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ text: null, error: error.message, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const allLines = useMemo(() => {
    if (!state.text) return null;
    const tokenize = TOKENIZERS[language];
    if (tokenize) {
      return tokenize(state.text);
    }
    return state.text
      .split("\n")
      .map((content) => [{ type: "text", text: content }]);
  }, [state.text, language]);

  const slice = useMemo(() => {
    if (!allLines) return null;
    const hasRange = Number.isFinite(startLine) && Number.isFinite(endLine);
    const from = hasRange
      ? Math.max(1, startLine - contextLines - expandAbove)
      : 1;
    const to = hasRange
      ? Math.min(allLines.length, endLine + contextLines + expandBelow)
      : allLines.length;
    const rows = [];
    for (let lineNo = from; lineNo <= to; lineNo += 1) {
      rows.push({
        lineNo,
        tokens: allLines[lineNo - 1] ?? [],
        highlighted: hasRange && lineNo >= startLine && lineNo <= endLine,
      });
    }
    return {
      rows,
      canExpandAbove: hasRange && from > 1,
      canExpandBelow: hasRange && to < allLines.length,
      remainingAbove: from - 1,
      remainingBelow: allLines.length - to,
    };
  }, [allLines, startLine, endLine, contextLines, expandAbove, expandBelow]);

  if (state.loading) {
    return (
      <StatusBoxStyled className={className}>
        <CircularProgress size={16} />
        <Typography variant="body2">Loading source…</Typography>
      </StatusBoxStyled>
    );
  }

  if (state.error) {
    return (
      <StatusBoxStyled className={className}>
        <Typography variant="body2">
          Couldn’t load source ({state.error}).
        </Typography>
      </StatusBoxStyled>
    );
  }

  if (!slice || slice.rows.length === 0) {
    return (
      <StatusBoxStyled className={className}>
        <Typography variant="body2">Empty file.</Typography>
      </StatusBoxStyled>
    );
  }

  const { rows, canExpandAbove, canExpandBelow, remainingAbove, remainingBelow } = slice;
  const width = String(rows[rows.length - 1].lineNo).length;
  const stepAbove = Math.min(EXPAND_STEP, remainingAbove);
  const stepBelow = Math.min(EXPAND_STEP, remainingBelow);

  return (
    <WrapperStyled className={className} scheme={scheme}>
      {canExpandAbove && (
        <ExpandRowStyled
          type="button"
          onClick={() => setExpandAbove((n) => n + EXPAND_STEP)}
          aria-label={`Show ${stepAbove} more lines above`}
        >
          <ExpandLess />
          Show {stepAbove} more line{stepAbove === 1 ? "" : "s"} above
          {remainingAbove > stepAbove ? ` (${remainingAbove} hidden)` : ""}
        </ExpandRowStyled>
      )}
      {rows.map((row) => (
        <LineRowStyled
          key={row.lineNo}
          className={row.highlighted ? "highlight" : undefined}
        >
          <span className="line-number">
            {String(row.lineNo).padStart(width, " ")}
          </span>
          <span className="line-content">
            {row.tokens.length === 0 ? (
              " "
            ) : (
              row.tokens.map((token, index) => (
                <span key={index} className={`tok-${token.type}`}>
                  {token.text}
                </span>
              ))
            )}
          </span>
        </LineRowStyled>
      ))}
      {canExpandBelow && (
        <ExpandRowStyled
          type="button"
          onClick={() => setExpandBelow((n) => n + EXPAND_STEP)}
          aria-label={`Show ${stepBelow} more lines below`}
        >
          <ExpandMore />
          Show {stepBelow} more line{stepBelow === 1 ? "" : "s"} below
          {remainingBelow > stepBelow ? ` (${remainingBelow} hidden)` : ""}
        </ExpandRowStyled>
      )}
    </WrapperStyled>
  );
}

export default CodeSnippet;

CodeSnippet.propTypes = {
  url: PropTypes.string.isRequired,
  startLine: PropTypes.number,
  endLine: PropTypes.number,
  contextLines: PropTypes.number,
  language: PropTypes.oneOf(["plain", "circom", "rust", "go", "cairo"]),
  className: PropTypes.string,
};
