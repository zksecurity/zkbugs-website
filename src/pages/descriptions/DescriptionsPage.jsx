import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router";
import {
  Box,
  Chip,
  Paper,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import { api } from "../../api/api";
import Container from "../../components/layout/Container";
import { useBugs } from "../../hooks/useBugs";
import { bugPath } from "../../utils/paths";

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

const SectionStyled = styled("section")({
  marginTop: "3rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const SectionHeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: "0.75rem",
  "& .count": {
    color: theme.palette.text.secondary,
    fontSize: "0.95rem",
    fontWeight: 400,
  },
}));

const GridStyled = styled("div")(({ theme }) => ({
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const ListStyled = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

const CardStyled = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "accent" && prop !== "view",
})(({ theme, accent, view }) => ({
  padding: view === "list" ? "1rem 1.25rem" : "1.25rem 1.5rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderLeft: `3px solid ${accent}`,
  borderRadius: "0.5rem",
  display: view === "list" ? "grid" : "flex",
  gridTemplateColumns: view === "list" ? "minmax(200px, 260px) 1fr" : undefined,
  gap: view === "list" ? "1.25rem" : "0.5rem",
  flexDirection: view === "list" ? undefined : "column",
  alignItems: view === "list" ? "baseline" : "stretch",
  transition: "transform 120ms ease, border-color 120ms ease",
  "&:hover": {
    borderColor: accent,
    transform: view === "list" ? "none" : "translateY(-2px)",
  },
  "& .card-title": {
    fontWeight: 600,
    fontSize: "1.05rem",
  },
  "& .card-body": {
    color: theme.palette.text.secondary,
    lineHeight: 1.55,
  },
  "& .examples": {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    marginTop: view === "list" ? "0.25rem" : "0.5rem",
  },
  "& .examples-label": {
    color: theme.palette.text.secondary,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  "& .examples-chips": {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.35rem",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: view === "list" ? "1fr" : undefined,
    gap: view === "list" ? "0.35rem" : "0.5rem",
  },
}));

const ACCENTS = [
  "#5eead4",
  "#a78bfa",
  "#f472b6",
  "#60a5fa",
  "#facc15",
  "#fb923c",
  "#f87171",
  "#34d399",
  "#38bdf8",
  "#c084fc",
];

const accentFor = (title, index) => {
  const hash = String(title)
    .split("")
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, index);
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
};

function DescriptionSection({ title, items, view, bugsById }) {
  const Layout = view === "list" ? ListStyled : GridStyled;
  return (
    <SectionStyled>
      <SectionHeaderStyled>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <span className="count">
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </span>
      </SectionHeaderStyled>
      <Layout>
        {items.map((item, index) => {
          const examples = item.examples ?? [];
          const textBlock = (
            <>
              <Typography className="card-title">{item.title}</Typography>
              <Typography variant="body2" className="card-body">
                {item.description}
              </Typography>
            </>
          );
          const examplesBlock = examples.length > 0 && (
            <div className="examples">
              <span className="examples-label">Examples</span>
              <div className="examples-chips">
              {examples.map((id) => {
                const bug = bugsById.get(id);
                const label = bug?.title ?? id;
                return (
                  <Tooltip
                    key={id}
                    title={bug ? `${bug.dsl} · ${id}` : id}
                    placement="top"
                  >
                    <Chip
                      label={label}
                      size="small"
                      clickable
                      component={RouterLink}
                      to={bugPath(id)}
                      variant="outlined"
                      sx={{
                        maxWidth: 360,
                        height: "auto",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          lineHeight: 1.3,
                          paddingTop: "4px",
                          paddingBottom: "4px",
                        },
                      }}
                    />
                  </Tooltip>
                );
              })}
              </div>
            </div>
          );
          return (
            <CardStyled
              key={item.title ?? index}
              elevation={0}
              accent={accentFor(item.title, index)}
              view={view}
            >
              {view === "list" ? (
                <>
                  <Typography className="card-title">{item.title}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <Typography variant="body2" className="card-body">
                      {item.description}
                    </Typography>
                    {examplesBlock}
                  </Box>
                </>
              ) : (
                <>
                  {textBlock}
                  {examplesBlock}
                </>
              )}
            </CardStyled>
          );
        })}
      </Layout>
    </SectionStyled>
  );
}

DescriptionSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      examples: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  view: PropTypes.oneOf(["grid", "list"]).isRequired,
  bugsById: PropTypes.instanceOf(Map).isRequired,
};

function DescriptionsPage() {
  const bugs = useBugs();
  const bugsById = useMemo(() => {
    const map = new Map();
    bugs.forEach((b) => b.id && map.set(b.id, b));
    return map;
  }, [bugs]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [rootCauses, setRootCauses] = useState([]);
  const [view, setView] = useState("grid");

  useEffect(() => {
    api.fetchDescriptions().then((descriptions) => {
      setVulnerabilities(descriptions.vulnerabilities ?? []);
      const sortedRootCauses = [...(descriptions.rootCauses ?? [])].sort((a, b) =>
        String(a.title).localeCompare(String(b.title), undefined, {
          sensitivity: "base",
        })
      );
      setRootCauses(sortedRootCauses);
    });
  }, []);

  const handleViewChange = (_event, next) => {
    if (next) setView(next);
  };

  return (
    <Container>
      <PageWrapperStyled>
        <PageHeaderStyled>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Definitions
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginTop: "0.5rem", maxWidth: 760 }}
            >
              The vulnerability categories and root causes used to classify
              every bug in the dataset. Use them to understand what each label
              means when filtering the bugs table.
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

        <DescriptionSection
          title="Vulnerability Categories"
          items={vulnerabilities}
          view={view}
          bugsById={bugsById}
        />
        <DescriptionSection
          title="Root Causes"
          items={rootCauses}
          view={view}
          bugsById={bugsById}
        />
      </PageWrapperStyled>
    </Container>
  );
}

export default DescriptionsPage;
