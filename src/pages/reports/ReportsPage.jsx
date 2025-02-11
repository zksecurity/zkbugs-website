import { styled } from "@mui/material";
import Container from "../../components/layout/Container";
import { useFilteredData } from "../../hooks/useFilteredData";
import { useReports } from "../../hooks/useReports";
import ReportsTable from "../../components/tables/ReportsTable";
import ReportsFilters from "../../components/filters/ReportsFilters";

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

function ReportsPage() {
  const reportsData = useReports();
  const { filteredData, updateFilters } = useFilteredData(reportsData);
  return (
    <>
      <FiltersSection className="filters-section">
        <ReportsFilters
          data={reportsData}
          className="filters"
          onChange={updateFilters}
        />
      </FiltersSection>
      <SectionContainer>
        <ReportsTable data={filteredData} />
      </SectionContainer>
    </>
  );
}

export default ReportsPage;
