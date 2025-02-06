import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material";
import useTableConfig from "../../hooks/useTableConfig";

const DataGridStyled = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders [role=row]": {
    backgroundColor: theme.palette.background.paper,
    "& .MuiDataGrid-columnHeaderTitle": {
      textTransform: "uppercase",
      // color: "#657795",
      color: theme.palette.text.secondary,
    },
  },
  "& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
}));

function BugsTable({ data }) {
  const { rows, columns } = useTableConfig(data);
  return (
    <DataGridStyled
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
}

export default BugsTable;

BugsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dsl: PropTypes.string,
      impact: PropTypes.string,
      id: PropTypes.string,
      title: PropTypes.string,
      reproduced: PropTypes.bool,
      rootCause: PropTypes.string,
      vulnerability: PropTypes.string,
      similarBugs: PropTypes.arrayOf(PropTypes.string),
      source: PropTypes.shape({
        variant: PropTypes.string,
        variantName: PropTypes.string,
        sourceLink: PropTypes.string,
      }),
    })
  ),
};
