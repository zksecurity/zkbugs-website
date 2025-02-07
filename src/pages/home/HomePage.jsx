import { styled } from "@mui/material";
import BugsTable from "../../components/bugs-table/BugsTable";
import Container from "../../components/layout/Container";
import ChartsSection from "../../components/charts-section/ChartsSection";
import BugsFilters from "../../components/bugs-filters/BugsFilters";
import { useBugs } from "../../hooks/useBugs";
import { useFilteredBugs } from "../../hooks/useFilteredBugs";

const SECTION_SPACER = "4rem";

const SectionContainer = styled(Container)({
  marginTop: SECTION_SPACER,
});

const FiltersSection = styled("div")(({ theme }) => ({
  marginTop: SECTION_SPACER,
  position: "sticky",
  top: "57px",
  zIndex: 9,
  "& .bug-filters": {
    padding: "0 1rem",
    borderRadius: "0 0 0.5rem 0.5rem",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    "& .filters-inputs-container": {
      paddingTop: "1rem",
      paddingBottom: "1rem",
    },
  },
  [theme.breakpoints.down("sm")]: {
    top: "47px",
    "& .bug-filters": {
      "& .filters-inputs-container": {
        paddingTop: "0.75rem",
        paddingBottom: "0.625rem",
      },
    },
  },
}));

function HomePage() {
  const bugsData = useBugs();
  const { filteredBugs, updateFilters } = useFilteredBugs(bugsData);
  return (
    <>
      <FiltersSection className="filters-section">
        <BugsFilters
          data={bugsData}
          className="bug-filters"
          onChange={updateFilters}
        />
      </FiltersSection>
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
