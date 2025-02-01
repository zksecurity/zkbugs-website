import { styled } from "@mui/material";
import BugsTable from "../../components/bugs-table/BugsTable";
import Container from "../../components/layout/Container";
import ChartsSection from "../../components/charts-section/ChartsSection";
import BugsFilters from "../../components/bugs-filters/BugsFilters";
import { useBugs } from "../../hooks/useBugs";
import { useFilteredBugs } from "../../hooks/useFilteredBugs";

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
  const { filteredBugs, updateFilters } = useFilteredBugs(bugsData);
  return (
    <>
      <SectionContainer className="filters-section">
        <BugsFilters data={bugsData} onChange={updateFilters} />
      </SectionContainer>
      <SectionContainer>
        <ChartsSection data={filteredBugs} />
      </SectionContainer>
      <SectionContainer>
        <BugsTable data={filteredBugs} />
      </SectionContainer>
    </>
  );
}

export default HomePage;
