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
      setRootCauses(descriptions.rootCauses);
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
