import { useEffect, useState } from "react";
import { Check, Clear } from "@mui/icons-material";
import { getTrimmedPathFromUrl } from "../utils/transformations";
import Menu from "../components/menu/Menu";
import { Typography } from "@mui/material";

const columnsStaticConfig = [
  {
    field: "title",
    headerName: "Title",
    width: 230,
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
    renderCell: (params) => {
      return (
        <a href={params.row.project} target="_blank">
          {getTrimmedPathFromUrl(params.row.project)}
        </a>
      );
    },
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
  },
  {
    field: "reproduced",
    headerName: "Reproduced",
    sortable: false,
    width: 150,
    align: "center",
    renderCell: (params) => {
      return params.row.reproduced ? (
        <Check color="success" />
      ) : (
        <Clear color="error" />
      );
    },
  },
  {
    field: "similarBugs",
    headerName: "Similar Bugs",
    width: 230,
    renderCell: (params) => {
      const total = params.row.similarBugs?.length ?? 0;

      if (total === 0) {
        return (
          <span style={{ fontStyle: "italic", fontWeight: 100 }}>
            No Similar Bugs
          </span>
        );
      }
      const text = total === 1 ? "Similar Bug" : "Similar Bugs";
      return (
        <Menu options={params.row.similarBugs}>
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
    renderCell: (params) => {
      return (
        <a href={params.row.source.sourceLink} target="_blank">
          {params.row.source.variantName}
        </a>
      );
    },
  },
];

const useTableConfig = (data) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const config = [...columnsStaticConfig];
    setColumns(config);
    setRows(data);
  }, [data]);

  return { rows, columns };
};

export default useTableConfig;
