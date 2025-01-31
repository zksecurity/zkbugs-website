import { useEffect, useState } from "react";
import { Check, Clear } from "@mui/icons-material";
import { getTrimmedPathFromUrl } from "../utils/transformations";

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
    // renderCell: (params) => params.row.reproduced ?
  },
  {
    field: "similarBugs",
    headerName: "Similar Bugs",
    width: 230,
  },
];

const getSourceVariants = (data = []) => {
  const variants = [];
  data.forEach((item) => {
    const variant = item.source.variant;

    if (!variants.some((v) => v.variant)) {
      variants.push({ variant, variantName: item.source.variantName });
    }
  });

  return variants;
};

const getColumnsConfig = (data = []) => {
  const config = [...columnsStaticConfig];

  const sourceVariants = getSourceVariants(data);

  return [
    ...config,
    ...sourceVariants.map((variant) => {
      return {
        field: variant.variant,
        headerName: variant.variantName,
        width: 250,
        renderCell: (params) => (
          <a href={params.row.source.sourceLink} target="_blank">
            {params.row.source.sourceLink}
          </a>
        ),
      };
    }),
  ];
};

const useTableConfig = (data) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const config = getColumnsConfig(data);
    setColumns(config);
    setRows(data);
  }, [data]);

  return { rows, columns };
};

export default useTableConfig;
