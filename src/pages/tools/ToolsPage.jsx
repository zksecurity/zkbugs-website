import { Typography } from "@mui/material";
import Container from "../../components/layout/Container";
import ToolsTable from "../../components/tools-table/ToolsTable";

function ToolsPage() {
  return (
    <Container sx={{ marginTop: "4rem" }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "4rem" }}
      >
        Security Tools
      </Typography>
      <ToolsTable />
    </Container>
  );
}

export default ToolsPage;
