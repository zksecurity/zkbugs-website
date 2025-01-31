import { useEffect, useState } from "react";
import BugsTable from "../../components/bugs-table/BugsTable";
import Container from "../../components/layout/Container";
import { api } from "../../api/api";

function HomePage() {
  const [bugsData, setBugsData] = useState([]);

  useEffect(() => {
    api.fetchBugs().then((data) => {
      setBugsData(data);
    });
  }, []);
  return (
      <Container sx={{ marginTop: "4rem" }}>
        <BugsTable data={bugsData} />
      </Container>
  );
}

export default HomePage;
