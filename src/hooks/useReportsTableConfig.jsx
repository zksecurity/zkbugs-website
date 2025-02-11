import { useEffect, useState } from "react";
import { Link, styled } from "@mui/material";
import { Launch as LaunchIcon } from "@mui/icons-material";
import { getTrimmedPathFromUrl } from "../utils/transformations";

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
  "&.title-link": {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

const columnsStaticConfig = [
  {
    field: "id",
    headerName: "ID",
    width: 230,
  },
  {
    field: "dsl",
    headerName: "DSL",
    width: 200,
  },
  {
    field: "project",
    headerName: "Project",
    width: 250,
    renderCell: (params) => {
      return (
        <LinkStyled href={params.row.project} target="_blank">
          {getTrimmedPathFromUrl(params.row.project)}
        </LinkStyled>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
  },
  {
    field: "auditor",
    headerName: "Auditor",
    width: 200,
  },
  {
    field: "report",
    headerName: "Report",
    sortable: false,
    width: 100,
    align: "center",
    renderCell: (params) => {
      return (
        <LinkStyled
          href={params.row.report}
          target="_blank"
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LaunchIcon />
        </LinkStyled>
      );
    },
  },
];

const useReportsTableConfig = (data) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const config = [...columnsStaticConfig];
    setColumns(config);
    setRows(data);
  }, [data]);

  return { rows, columns };
};

export default useReportsTableConfig;
