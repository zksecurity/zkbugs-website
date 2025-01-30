export const columnsStaticConfig = [
  {
    field: "title",
    headerName: "Title",
    width: 200,
  },
  {
    field: "dsl",
    headerName: "DSL",
    width: 150,
  },
  {
    field: "project",
    headerName: "Project",
    width: 150,
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
    width: 150,
    sortable: false,
    // renderCell: (params) => params.row.reproduced ?
  },
  {
    field: "similarBugs",
    headerName: "Similar Bugs",
    width: 200,
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

export const getColumnsConfig = (data = []) => {
  const config = [...columnsStaticConfig];

  const sourceVariants = getSourceVariants(data);

  return [
    ...config,
    ...sourceVariants.map((variant) => {
      return {
        field: variant.variant,
        headerName: variant.variantName,
        width: 200,
        renderCell: (params) => params.row.source.sourceLink,
      };
    }),
  ];
};
