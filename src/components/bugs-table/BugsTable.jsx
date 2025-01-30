import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material";
import useTableConfig from "../../hooks/useTableConfig";

const DataGridStyled = styled(DataGrid)({
  "& .MuiDataGrid-columnHeaders [role=row]": {
    backgroundColor: "#f3f3f3",
    "& .MuiDataGrid-columnHeaderTitle": {
      textTransform: "uppercase",
      color: "#657795",
    },
  },
});

function BugsTable() {
  const { rows, columns } = useTableConfig();
  return <DataGridStyled rows={rows} columns={columns} />;
}

export default BugsTable;
