import { useMemo } from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import { IconButton, Link, styled, Tooltip, Typography } from "@mui/material";
import { Check, Clear, OpenInNew } from "@mui/icons-material";
import { bugPath } from "../utils/paths";
import { getTrimmedPathFromUrl } from "../utils/transformations";
import Menu from "../components/menu/Menu";

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
  "&.title-link": {
    fontWeight: 600,
    color: theme.palette.text.primary,
    wordBreak: "break-word",
  },
}));

const TitleCellStyled = styled("div")({
  display: "flex",
  alignItems: "flex-start",
  gap: "0.25rem",
  width: "100%",
  paddingTop: "2px",
});

const BUG_BASE_URL = "https://github.com/zksecurity/zkbugs/tree/main/";

const useBugsTableConfig = (data, allBugs = []) => {
  const navigate = useNavigate();

  const bugsById = useMemo(() => {
    const map = new Map();
    (allBugs ?? []).forEach((bug) => {
      if (bug?.id) map.set(bug.id, bug);
    });
    return map;
  }, [allBugs]);

  const columns = useMemo(
    () => [
      {
        field: "title",
        headerName: "Title",
        width: 280,
        cellClassName: "wrap-cell",
        renderCell: (params) => (
          <TitleCellStyled>
            <LinkStyled
              component={RouterLink}
              to={bugPath(params.row.id)}
              className="title-link"
            >
              {params.row.title}
            </LinkStyled>
            <Tooltip title="View on GitHub">
              <IconButton
                size="small"
                component="a"
                href={BUG_BASE_URL + params.row.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                sx={{ flex: "0 0 auto" }}
              >
                <OpenInNew sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </TitleCellStyled>
        ),
      },
      {
        field: "dsl",
        headerName: "DSL",
        width: 130,
      },
      {
        field: "project",
        headerName: "Project",
        width: 220,
        renderCell: (params) => (
          <LinkStyled href={params.row.project} target="_blank">
            {getTrimmedPathFromUrl(params.row.project)}
          </LinkStyled>
        ),
      },
      {
        field: "vulnerability",
        headerName: "Vulnerability",
        width: 200,
      },
      {
        field: "impact",
        headerName: "Impact",
        width: 150,
      },
      {
        field: "rootCause",
        headerName: "Root Cause",
        width: 200,
        cellClassName: "wrap-cell",
      },
      {
        field: "compiledDirect",
        headerName: "Compiled",
        sortable: true,
        width: 130,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const direct = params.row.compiledDirect;
          const original = params.row.compiledOriginal;
          const tooltip =
            direct === undefined && original === undefined
              ? "No compile status recorded"
              : `Direct: ${direct ? "✓" : "✗"}  ·  Original: ${original ? "✓" : "✗"}`;
          return (
            <Tooltip title={tooltip}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {direct ? (
                  <Check color="success" />
                ) : (
                  <Clear color="error" />
                )}
              </span>
            </Tooltip>
          );
        },
      },
      {
        field: "similarBugs",
        headerName: "Similar Bugs",
        width: 220,
        sortable: false,
        renderCell: (params) => {
          const similar = params.row.similarBugs ?? [];
          const total = similar.length;

          if (total === 0) {
            return (
              <span style={{ fontStyle: "italic", fontWeight: 100 }}>
                No Similar Bugs
              </span>
            );
          }

          const options = similar.map((id) => ({
            id,
            label: bugsById.get(id)?.title ?? id,
          }));

          const text = total === 1 ? "Similar Bug" : "Similar Bugs";
          return (
            <Menu
              options={options}
              renderOption={(option) => option.label}
              onSelect={(option) => navigate(bugPath(option.id))}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {`${total} ${text}`}
              </Typography>
            </Menu>
          );
        },
      },
      {
        field: "source",
        headerName: "Source",
        width: 180,
        renderCell: (params) => (
          <LinkStyled href={params.row.source.sourceLink} target="_blank">
            {params.row.source.variantName}
          </LinkStyled>
        ),
      },
    ],
    [bugsById, navigate]
  );

  return { rows: data ?? [], columns };
};

export default useBugsTableConfig;
