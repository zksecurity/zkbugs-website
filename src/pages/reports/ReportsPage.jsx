import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router";
import {
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
} from "@mui/material";
import {
  OpenInNew,
  PictureAsPdf,
  ViewList,
  ViewModule,
} from "@mui/icons-material";
import Container from "../../components/layout/Container";
import { useReports } from "../../hooks/useReports";
import { reportPath } from "../../utils/paths";
import { getTrimmedPathFromUrl } from "../../utils/transformations";

const PageWrapperStyled = styled("div")({
  margin: "3rem 0 4rem",
});

const PageHeaderStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "1.5rem",
  flexWrap: "wrap",
});

const FiltersContainerStyled = styled("div")({
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

const FilterRowStyled = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "80px 1fr",
  alignItems: "center",
  columnGap: "0.75rem",
  rowGap: "0.5rem",
  "& .filter-label": {
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  "& .chip-row": {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.35rem",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const GridStyled = styled("div")(({ theme }) => ({
  marginTop: "1.5rem",
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const ListStyled = styled("div")({
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

const GridCardStyled = styled(Paper)(({ theme }) => ({
  padding: "1.25rem 1.5rem 1rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  transition: "transform 120ms ease, border-color 120ms ease",
  "&:hover": {
    borderColor: theme.palette.secondary.main,
    transform: "translateY(-2px)",
  },
  "& .date-label": {
    color: theme.palette.text.secondary,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  "& .project-name": {
    fontWeight: 600,
    fontSize: "1.05rem",
    lineHeight: 1.3,
    wordBreak: "break-word",
  },
  "& .notes": {
    color: theme.palette.text.secondary,
    fontStyle: "italic",
    fontSize: "0.88rem",
  },
  "& .link-button": {
    alignSelf: "flex-start",
    textTransform: "none",
    padding: 0,
    marginTop: "auto",
    minHeight: 0,
    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
  },
}));

const ListRowStyled = styled(Paper)(({ theme }) => ({
  padding: "0.85rem 1.25rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  display: "grid",
  gridTemplateColumns: "110px minmax(200px, 1fr) minmax(200px, 1.4fr) auto",
  columnGap: "1.25rem",
  alignItems: "center",
  transition: "border-color 120ms ease",
  "&:hover": {
    borderColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    rowGap: "0.5rem",
  },
  "& .date-label": {
    color: theme.palette.text.secondary,
    fontSize: "0.82rem",
  },
  "& .project-name": {
    fontWeight: 600,
    wordBreak: "break-word",
  },
  "& .link-button": {
    justifySelf: "end",
    textTransform: "none",
    padding: 0,
    minHeight: 0,
    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
  },
}));

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

const normalizeCommit = (commit) => {
  if (!commit) return null;
  const clean = commit.startsWith("0x") ? commit.slice(2) : commit;
  return clean.length > 10 ? clean.slice(0, 10) : clean;
};

function ReportsPage() {
  const reports = useReports();
  const [activeDsl, setActiveDsl] = useState("All");
  const [activeAuditor, setActiveAuditor] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [view, setView] = useState("grid");

  const dsls = useMemo(() => {
    const set = new Set();
    reports.forEach((r) => r.dsl && set.add(r.dsl));
    return ["All", ...Array.from(set).sort()];
  }, [reports]);

  const auditors = useMemo(() => {
    const set = new Set();
    reports.forEach((r) => r.auditor && set.add(r.auditor));
    return ["All", ...Array.from(set).sort()];
  }, [reports]);

  const types = useMemo(() => {
    const set = new Set();
    reports.forEach((r) => r.type && set.add(r.type));
    return ["All", ...Array.from(set).sort()];
  }, [reports]);

  const filtered = useMemo(() => {
    const matches = (current, value) => current === "All" || current === value;
    const rows = reports.filter(
      (r) =>
        matches(activeDsl, r.dsl) &&
        matches(activeAuditor, r.auditor) &&
        matches(activeType, r.type)
    );
    return rows.slice().sort((a, b) => {
      const da = parseDate(a.date)?.getTime() ?? 0;
      const db = parseDate(b.date)?.getTime() ?? 0;
      return db - da;
    });
  }, [reports, activeDsl, activeAuditor, activeType]);

  const handleViewChange = (_event, next) => {
    if (next) setView(next);
  };

  return (
    <Container>
      <PageWrapperStyled>
        <PageHeaderStyled>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Audit Reports
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginTop: "0.5rem", maxWidth: 760 }}
            >
              Public audit reports and disclosures for ZK projects catalogued
              in the dataset. Filter by DSL, auditor, or type to narrow down
              what you&apos;re looking for.
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
            color="secondary"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <Tooltip title="Grid view">
                <ViewModule fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <Tooltip title="List view">
                <ViewList fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </PageHeaderStyled>

        <FiltersContainerStyled>
          <FilterRowStyled>
            <span className="filter-label">DSL</span>
            <div className="chip-row">
              {dsls.map((dsl) => (
                <Chip
                  key={dsl}
                  label={dsl}
                  size="small"
                  clickable
                  color={activeDsl === dsl ? "secondary" : "default"}
                  variant={activeDsl === dsl ? "filled" : "outlined"}
                  onClick={() => setActiveDsl(dsl)}
                />
              ))}
            </div>
          </FilterRowStyled>
          <FilterRowStyled>
            <span className="filter-label">Auditor</span>
            <div className="chip-row">
              {auditors.map((auditor) => (
                <Chip
                  key={auditor}
                  label={auditor}
                  size="small"
                  clickable
                  color={activeAuditor === auditor ? "secondary" : "default"}
                  variant={activeAuditor === auditor ? "filled" : "outlined"}
                  onClick={() => setActiveAuditor(auditor)}
                />
              ))}
            </div>
          </FilterRowStyled>
          {types.length > 2 && (
            <FilterRowStyled>
              <span className="filter-label">Type</span>
              <div className="chip-row">
                {types.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    size="small"
                    clickable
                    color={activeType === type ? "secondary" : "default"}
                    variant={activeType === type ? "filled" : "outlined"}
                    onClick={() => setActiveType(type)}
                  />
                ))}
              </div>
            </FilterRowStyled>
          )}
        </FiltersContainerStyled>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginTop: "1rem" }}
        >
          {filtered.length === reports.length
            ? `${reports.length} report${reports.length === 1 ? "" : "s"}`
            : `${filtered.length} of ${reports.length} report${
                reports.length === 1 ? "" : "s"
              }`}
        </Typography>

        {view === "grid" ? (
          <GridStyled>
            {filtered.map((report) => {
              const commit = normalizeCommit(report.commit);
              return (
                <GridCardStyled key={report.id} elevation={0}>
                  <span className="date-label">{formatDate(report.date)}</span>
                  <Typography
                    component={report.project ? "a" : "div"}
                    href={report.project || undefined}
                    target={report.project ? "_blank" : undefined}
                    rel={report.project ? "noopener noreferrer" : undefined}
                    className="project-name"
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": report.project
                        ? { textDecoration: "underline" }
                        : undefined,
                    }}
                  >
                    {report.project
                      ? getTrimmedPathFromUrl(report.project)
                      : report.id}
                  </Typography>
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
                    {report.auditor && (
                      <Chip
                        label={report.auditor}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {report.type && (
                      <Chip
                        label={report.type}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {commit && (
                      <Tooltip title={`Commit: ${report.commit}`}>
                        <Chip
                          label={commit}
                          size="small"
                          variant="outlined"
                          sx={{ fontFamily: "Roboto Mono, monospace" }}
                        />
                      </Tooltip>
                    )}
                  </Stack>
                  {report.notes && (
                    <Typography className="notes">{report.notes}</Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ marginTop: "auto" }}>
                    <Button
                      className="link-button"
                      component={RouterLink}
                      to={reportPath(report.id)}
                      variant="text"
                      color="secondary"
                      size="small"
                      startIcon={<PictureAsPdf fontSize="small" />}
                    >
                      View report
                    </Button>
                    {report.pdfUrl && (
                      <Tooltip title="Open PDF in new tab">
                        <Button
                          component="a"
                          href={report.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="text"
                          color="secondary"
                          size="small"
                          sx={{
                            minWidth: 0,
                            padding: "0 0.25rem",
                            "&:hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <OpenInNew fontSize="small" />
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </GridCardStyled>
              );
            })}
          </GridStyled>
        ) : (
          <ListStyled>
            {filtered.map((report) => (
              <ListRowStyled key={report.id} elevation={0}>
                <span className="date-label">{formatDate(report.date)}</span>
                <Typography
                  component={report.project ? "a" : "div"}
                  href={report.project || undefined}
                  target={report.project ? "_blank" : undefined}
                  rel={report.project ? "noopener noreferrer" : undefined}
                  className="project-name"
                  sx={{
                    color: "text.primary",
                    textDecoration: "none",
                    "&:hover": report.project
                      ? { textDecoration: "underline" }
                      : undefined,
                  }}
                >
                  {report.project
                    ? getTrimmedPathFromUrl(report.project)
                    : report.id}
                </Typography>
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
                  {report.auditor && (
                    <Chip
                      label={report.auditor}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {report.type && report.type !== "Audit Report" && (
                    <Chip label={report.type} size="small" variant="outlined" />
                  )}
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifySelf: "end", alignItems: "center" }}
                >
                  <Button
                    className="link-button"
                    component={RouterLink}
                    to={reportPath(report.id)}
                    variant="text"
                    color="secondary"
                    size="small"
                    startIcon={<PictureAsPdf fontSize="small" />}
                  >
                    View
                  </Button>
                  {report.pdfUrl && (
                    <Tooltip title="Open PDF in new tab">
                      <Button
                        component="a"
                        href={report.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="text"
                        color="secondary"
                        size="small"
                        sx={{
                          minWidth: 0,
                          padding: "0 0.25rem",
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                      >
                        <OpenInNew fontSize="small" />
                      </Button>
                    </Tooltip>
                  )}
                </Stack>
              </ListRowStyled>
            ))}
          </ListStyled>
        )}

        {filtered.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            fontStyle="italic"
            sx={{ marginTop: "2rem" }}
          >
            No reports match these filters.
          </Typography>
        )}
      </PageWrapperStyled>
    </Container>
  );
}

export default ReportsPage;
