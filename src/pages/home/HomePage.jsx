import { styled } from "@mui/material";
import BugsTable from "../../components/bugs-table/BugsTable";
import Container from "../../components/layout/Container";
import ChartsSection from "../../components/charts-section/ChartsSection";
import BugsFilters from "../../components/bugs-filters/BugsFilters";
import { useBugs } from "../../hooks/useBugs";

const SectionContainer = styled(Container)({
  marginTop: "4rem",
  "&.filters-section": {
    position: "sticky",
    top: "57px",
    zIndex: 10,
  },
});

function HomePage() {
  const bugsData = useBugs();

  return (
    <>
      <SectionContainer className="filters-section">
        <BugsFilters data={bugsData} />
      </SectionContainer>
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
