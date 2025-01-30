import BugsTable from "../../components/bugs-table/BugsTable";
import Container from "../../components/layout/Container";

function HomePage() {
  return (
    <Container sx={{ marginTop: "4rem" }}>
      <BugsTable />
    </Container>
  );
}

export default HomePage;
