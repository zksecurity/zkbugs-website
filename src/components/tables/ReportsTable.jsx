import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material";
import useReportsTableConfig from "../../hooks/useReportsTableConfig";

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

function ReportsTable({ data }) {
  const { rows, columns } = useReportsTableConfig(data);
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

export default ReportsTable;

ReportsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      auditor: PropTypes.string,
      dsl: PropTypes.string,
      file: PropTypes.string,
      id: PropTypes.string,
      project: PropTypes.string,
    })
  ),
};
