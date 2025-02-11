import { styled } from "@mui/material";
import BugsTable from "../../components/tables/BugsTable";
import Container from "../../components/layout/Container";
import ChartsSection from "../../components/charts-section/ChartsSection";
import BugsFilters from "../../components/filters/BugsFilters";
import { useBugs } from "../../hooks/useBugs";
import { useFilteredData } from "../../hooks/useFilteredData";

const SECTION_SPACER = "4rem";

const SectionContainer = styled(Container)({
  marginTop: SECTION_SPACER,
});

const FiltersSection = styled("div")(({ theme }) => ({
  marginTop: SECTION_SPACER,
  position: "sticky",
  top: "57px",
  zIndex: 9,
  "& .filters": {
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
    "& .filters": {
      "& .filters-inputs-container": {
        paddingTop: "0.75rem",
        paddingBottom: "0.625rem",
      },
    },
  },
}));

function HomePage() {
  const bugsData = useBugs();
  const { filteredData, updateFilters } = useFilteredData(bugsData);
  return (
    <>
      <FiltersSection className="filters-section">
        <BugsFilters
          data={bugsData}
          className="filters"
          onChange={updateFilters}
        />
      </FiltersSection>
      <SectionContainer>
        <ChartsSection data={filteredData} />
      </SectionContainer>
      <SectionContainer>
        <BugsTable data={filteredData} />
      </SectionContainer>
    </>
  );
}

export default HomePage;
