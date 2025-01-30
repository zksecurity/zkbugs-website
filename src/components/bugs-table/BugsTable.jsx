import { DataGrid } from "@mui/x-data-grid";
import useTableConfig from "../../hooks/useTableConfig";
import Container from "../layout/Container";

function BugsTable() {
  const { rows, columns } = useTableConfig();
  return (
    <Container>
      <DataGrid rows={rows} columns={columns} />
    </Container>
  );
}

export default BugsTable;
