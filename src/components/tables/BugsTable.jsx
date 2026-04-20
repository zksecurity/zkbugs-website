import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material";
import useBugsTableConfig from "../../hooks/useBugsTableConfig";

const DataGridStyled = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders [role=row]": {
    backgroundColor: theme.palette.background.paper,
    "& .MuiDataGrid-columnHeaderTitle": {
      textTransform: "uppercase",
      color: theme.palette.text.secondary,
    },
  },
  "& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-cell.wrap-cell": {
    whiteSpace: "normal",
    lineHeight: 1.35,
    paddingTop: "8px",
    paddingBottom: "8px",
    alignItems: "center",
    display: "flex",
  },
}));

const bugShape = PropTypes.shape({
  dsl: PropTypes.string,
  impact: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
  compiledDirect: PropTypes.bool,
  compiledOriginal: PropTypes.bool,
  rootCause: PropTypes.string,
  vulnerability: PropTypes.string,
  similarBugs: PropTypes.arrayOf(PropTypes.string),
  source: PropTypes.shape({
    variant: PropTypes.string,
    variantName: PropTypes.string,
    sourceLink: PropTypes.string,
  }),
});

function BugsTable({ data, allBugs }) {
  const { rows, columns } = useBugsTableConfig(data, allBugs ?? data);
  return (
    <DataGridStyled
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      getRowHeight={() => "auto"}
    />
  );
}

export default BugsTable;

BugsTable.propTypes = {
  data: PropTypes.arrayOf(bugShape),
  allBugs: PropTypes.arrayOf(bugShape),
};
