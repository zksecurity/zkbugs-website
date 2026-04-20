import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress, styled, Typography } from "@mui/material";

const PreStyled = styled("pre")(({ theme }) => ({
  margin: 0,
  padding: "12px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  overflowX: "auto",
  fontFamily: "Roboto Mono, monospace",
  fontSize: "13px",
  lineHeight: "1.5",
  color: theme.palette.text.primary,
  maxHeight: "520px",
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

function CodeFromUrl({ url, className, maxBytes = 200_000 }) {
  const [state, setState] = useState({ text: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ text: null, error: null, loading: true });

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        if (cancelled) return;
        const trimmed =
          text.length > maxBytes
            ? text.slice(0, maxBytes) + "\n\n… (truncated)\n"
            : text;
        setState({ text: trimmed, error: null, loading: false });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ text: null, error: error.message, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [url, maxBytes]);

  if (state.loading) {
    return (
      <StatusBoxStyled className={className}>
        <CircularProgress size={16} />
        <Typography variant="body2">Loading {url.split("/").pop()}…</Typography>
      </StatusBoxStyled>
    );
  }

  if (state.error) {
    return (
      <StatusBoxStyled className={className}>
        <Typography variant="body2">
          Couldn’t load file ({state.error}).
        </Typography>
      </StatusBoxStyled>
    );
  }

  return <PreStyled className={className}>{state.text}</PreStyled>;
}

export default CodeFromUrl;

CodeFromUrl.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  maxBytes: PropTypes.number,
};
