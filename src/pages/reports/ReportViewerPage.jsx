import { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { ArrowBack, OpenInNew } from "@mui/icons-material";
import Container from "../../components/layout/Container";
import { useReports } from "../../hooks/useReports";
import { paths } from "../../utils/paths";
import { getTrimmedPathFromUrl } from "../../utils/transformations";

const PageWrapperStyled = styled("div")({
  margin: "2rem 0 4rem",
});

const HeaderCardStyled = styled(Paper)(({ theme }) => ({
  padding: "1.25rem 1.5rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  "& .meta-row": {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    alignItems: "center",
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
  },
  "& .meta-row .dot": {
    opacity: 0.5,
  },
  "& .notes": {
    color: theme.palette.text.secondary,
    fontStyle: "italic",
    fontSize: "0.92rem",
  },
}));

const IframeWrapStyled = styled("div")(({ theme }) => ({
  marginTop: "1.5rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  overflow: "hidden",
  height: "calc(100vh - 280px)",
  minHeight: 560,
  backgroundColor: theme.palette.background.paper,
}));

const IframeStyled = styled("iframe")({
  display: "block",
  width: "100%",
  height: "100%",
  border: 0,
});

const parseDate = (value) => {
  if (!value) return null;
  const parts = String(value).split("/");
  if (parts.length !== 3) return null;
  const [month, day, year] = parts.map((n) => Number(n));
  if (![month, day, year].every(Number.isFinite)) return null;
  return new Date(year, month - 1, day);
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function NotFoundState() {
  return (
    <Container>
      <PageWrapperStyled>
        <Typography variant="h4" gutterBottom>
          Report not found
        </Typography>
        <Button
          component={RouterLink}
          to={paths.reports}
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBack fontSize="small" />}
        >
          Back to reports
        </Button>
      </PageWrapperStyled>
    </Container>
  );
}

function ReportViewerPage() {
  const { reportId } = useParams();
  const reports = useReports();
  const decoded = decodeURIComponent(reportId ?? "");
  const report = reports.find((r) => r.id === decoded);
  const loading = reports.length === 0;

  useEffect(() => {
    if (report?.id) {
      const title = report.project
        ? getTrimmedPathFromUrl(report.project)
        : report.id;
      document.title = `${title} · Report · zkbugs`;
      return () => {
        document.title = "zkbugs";
      };
    }
    return undefined;
  }, [report?.id, report?.project]);

  if (loading) {
    return (
      <Container>
        <PageWrapperStyled>
          <Typography variant="body1">Loading report…</Typography>
        </PageWrapperStyled>
      </Container>
    );
  }

  if (!report) return <NotFoundState />;

  const title = report.project
    ? getTrimmedPathFromUrl(report.project)
    : report.id;

  return (
    <Container>
      <PageWrapperStyled>
        <Button
          component={RouterLink}
          to={paths.reports}
          size="small"
          variant="text"
          color="secondary"
          startIcon={<ArrowBack fontSize="small" />}
          sx={{ marginLeft: "-0.5rem", textTransform: "none" }}
        >
          All reports
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "0.5rem",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1}>
            {report.externalUrl && (
              <Button
                component="a"
                href={report.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="secondary"
                size="small"
                endIcon={<OpenInNew fontSize="small" />}
              >
                View on GitHub
              </Button>
            )}
            {report.pdfUrl && (
              <Button
                component="a"
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="secondary"
                size="small"
                endIcon={<OpenInNew fontSize="small" />}
              >
                Open PDF
              </Button>
            )}
          </Stack>
        </Box>

        <HeaderCardStyled elevation={0}>
          <div className="meta-row">
            {report.date && <span>{formatDate(report.date)}</span>}
            {report.auditor && (
              <>
                <span className="dot">·</span>
                <span>{report.auditor}</span>
              </>
            )}
          </div>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ flexWrap: "wrap", rowGap: "0.4rem" }}
          >
            {report.dsl && (
              <Chip
                label={report.dsl}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
            {report.type && (
              <Chip label={report.type} size="small" variant="outlined" />
            )}
            {report.commit && (
              <Chip
                label={
                  report.commit.startsWith("0x")
                    ? report.commit.slice(2, 12)
                    : report.commit.slice(0, 10)
                }
                size="small"
                variant="outlined"
                sx={{ fontFamily: "Roboto Mono, monospace" }}
              />
            )}
          </Stack>
          {report.notes && (
            <Typography className="notes">{report.notes}</Typography>
          )}
        </HeaderCardStyled>

        {report.isPdf && report.pdfUrl ? (
          <IframeWrapStyled>
            <IframeStyled
              src={`${report.pdfUrl}#view=FitH`}
              title={`${title} — audit report`}
            />
          </IframeWrapStyled>
        ) : (
          <Paper
            elevation={0}
            sx={{
              marginTop: "1.5rem",
              padding: "2rem",
              border: (theme) => `1px dashed ${theme.palette.borders.default}`,
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
              This report isn&apos;t a PDF and can&apos;t be embedded.
            </Typography>
            {report.externalUrl && (
              <Button
                component="a"
                href={report.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="secondary"
                endIcon={<OpenInNew fontSize="small" />}
              >
                Open on GitHub
              </Button>
            )}
          </Paper>
        )}
      </PageWrapperStyled>
    </Container>
  );
}

export default ReportViewerPage;
