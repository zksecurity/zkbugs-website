import { useEffect, useState } from "react";
import { api } from "../../api/api";
import DescriptionsTable from "../../components/descriptions-table/DescriptionsTable";
import Container from "../../components/layout/Container";

function DescriptionsPage() {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [rootCauses, setRootCauses] = useState([]);

  useEffect(() => {
    api.fetchDescriptions().then((descriptions) => {
      setVulnerabilities(descriptions.vulnerabilities);
      const sortedRootCauses = [...descriptions.rootCauses].sort((a, b) =>
        String(a.title).localeCompare(String(b.title), undefined, {
          sensitivity: "base",
        })
      );
      setRootCauses(sortedRootCauses);
    });
  }, []);
  return (
    <Container>
      <DescriptionsTable title="Vulnerabilities" data={vulnerabilities} />
      <DescriptionsTable title="Root Causes" data={rootCauses} />
    </Container>
  );
}

export default DescriptionsPage;
