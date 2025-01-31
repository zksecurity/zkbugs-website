import { styled } from "@mui/material";
import BugsTable from "../../components/bugs-table/BugsTable";
import Container from "../../components/layout/Container";
import ChartsSection from "../../components/charts-section/ChartsSection";
import { useBugs } from "../../hooks/useBugs";

const SectionContainer = styled(Container)({
  marginTop: "4rem",
});

function HomePage() {
  const bugsData = useBugs();

  return (
    <>
      <SectionContainer>
        <ChartsSection data={bugsData} />
      </SectionContainer>
      <SectionContainer>
        <BugsTable data={bugsData} />
      </SectionContainer>
    </>
  );
}

export default HomePage;
