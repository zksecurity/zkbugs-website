import { useEffect, useMemo, useState } from "react";
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
import { OpenInNew, ViewList, ViewModule } from "@mui/icons-material";
import { api } from "../../api/api";
import Container from "../../components/layout/Container";
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
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
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
  gap: "0.9rem",
  transition: "transform 120ms ease, border-color 120ms ease",
  "&:hover": {
    borderColor: theme.palette.secondary.main,
    transform: "translateY(-2px)",
  },
}));

const ListRowStyled = styled(Paper)(({ theme }) => ({
  padding: "0.85rem 1.25rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  display: "grid",
  gridTemplateColumns: "minmax(180px, 220px) 1fr auto",
  columnGap: "1.5rem",
  alignItems: "center",
  transition: "border-color 120ms ease",
  "&:hover": {
    borderColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    rowGap: "0.5rem",
  },
  "& .tool-name": {
    fontWeight: 600,
    fontSize: "1rem",
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

const splitList = (value) =>
  String(value ?? "")
    .split(/[,/]/)
    .map((part) => part.trim())
    .filter(Boolean);

function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [activeDsl, setActiveDsl] = useState("All");
  const [activeTechnique, setActiveTechnique] = useState("All");
  const [view, setView] = useState("grid");

  useEffect(() => {
    api.fetchSecurityTools().then((data) => setTools(data));
  }, []);

  const dsls = useMemo(() => {
    const set = new Set();
    tools.forEach((tool) =>
      splitList(tool.dsl).forEach((part) => set.add(part))
    );
    return ["All", ...Array.from(set).sort()];
  }, [tools]);

  const techniques = useMemo(() => {
    const set = new Set();
    tools.forEach((tool) =>
      splitList(tool.analysis).forEach((part) => set.add(part))
    );
    return ["All", ...Array.from(set).sort()];
  }, [tools]);

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const dslOk =
        activeDsl === "All" || splitList(tool.dsl).includes(activeDsl);
      const techniqueOk =
        activeTechnique === "All" ||
        splitList(tool.analysis).includes(activeTechnique);
      return dslOk && techniqueOk;
    });
  }, [tools, activeDsl, activeTechnique]);

  const handleViewChange = (_event, next) => {
    if (next) setView(next);
  };

  return (
    <Container>
      <PageWrapperStyled>
        <PageHeaderStyled>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Security Tools
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginTop: "0.5rem", maxWidth: 760 }}
            >
              Static analysis, symbolic execution, and formal verification
              tools for ZK circuits. Filter by DSL to find tools that target a
              specific stack.
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
            <span className="filter-label">Technique</span>
            <div className="chip-row">
              {techniques.map((technique) => (
                <Chip
                  key={technique}
                  label={technique}
                  size="small"
                  clickable
                  color={activeTechnique === technique ? "secondary" : "default"}
                  variant={activeTechnique === technique ? "filled" : "outlined"}
                  onClick={() => setActiveTechnique(technique)}
                />
              ))}
            </div>
          </FilterRowStyled>
        </FiltersContainerStyled>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginTop: "1rem" }}
        >
          {filtered.length === tools.length
            ? `${tools.length} tool${tools.length === 1 ? "" : "s"}`
            : `${filtered.length} of ${tools.length} tool${
                tools.length === 1 ? "" : "s"
              }`}
        </Typography>

        {view === "grid" ? (
          <GridStyled>
            {filtered.map((tool, index) => {
              const dslChips = splitList(tool.dsl);
              const analysisChips = splitList(tool.analysis);
              return (
                <GridCardStyled
                  key={tool.id ?? `${tool.tool}-${index}`}
                  elevation={0}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, lineHeight: 1.25 }}
                    >
                      {tool.tool}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ flexWrap: "wrap", rowGap: "0.4rem" }}
                  >
                    {dslChips.map((part) => (
                      <Chip
                        key={`dsl-${part}`}
                        label={part}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                    {analysisChips.map((part) => (
                      <Chip
                        key={`ana-${part}`}
                        label={part}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>

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
                      marginTop: "auto",
                      minHeight: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {getTrimmedPathFromUrl(tool.url)}
                  </Button>
                </GridCardStyled>
              );
            })}
          </GridStyled>
        ) : (
          <ListStyled>
            {filtered.map((tool, index) => {
              const dslChips = splitList(tool.dsl);
              const analysisChips = splitList(tool.analysis);
              return (
                <ListRowStyled
                  key={tool.id ?? `${tool.tool}-${index}`}
                  elevation={0}
                >
                  <Typography className="tool-name">{tool.tool}</Typography>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ flexWrap: "wrap", rowGap: "0.4rem" }}
                  >
                    {dslChips.map((part) => (
                      <Chip
                        key={`dsl-${part}`}
                        label={part}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                    {analysisChips.map((part) => (
                      <Chip
                        key={`ana-${part}`}
                        label={part}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                  <Button
                    className="link-button"
                    component="a"
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="text"
                    color="secondary"
                    size="small"
                    endIcon={<OpenInNew fontSize="small" />}
                  >
                    {getTrimmedPathFromUrl(tool.url)}
                  </Button>
                </ListRowStyled>
              );
            })}
          </ListStyled>
        )}

        {filtered.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            fontStyle="italic"
            sx={{ marginTop: "2rem" }}
          >
            No tools match this filter.
          </Typography>
        )}
      </PageWrapperStyled>
    </Container>
  );
}

export default ToolsPage;
