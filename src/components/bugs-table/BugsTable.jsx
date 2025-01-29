import { useEffect } from "react";
import Container from "../layout/Container";
import { api } from "../../api/api";

function BugsTable() {
  useEffect(() => {
    api.fetchBugs().then((data) => {
      console.log(data);
    });
  }, []);

  return <Container></Container>;
}

export default BugsTable;
