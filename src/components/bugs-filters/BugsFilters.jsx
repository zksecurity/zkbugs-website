import PropTypes from "prop-types";
import { styled } from "@mui/material";
import { FilterAltOutlined } from "@mui/icons-material";
import { useBugsAvailableFilters } from "../../hooks/useBugsAvailableFilters";
import Select from "../select/Select";
import { useCallback, useState } from "react";
import { getTrimmedPathFromUrl } from "../../utils/transformations";

const FILTERS = ["dsl", "vulnerability", "project", "reproduced", "rootCause"];

const renderFilterLabel = (filter, value) => {
  if (filter === "project") {
    return getTrimmedPathFromUrl(value);
  }
  return value;
};

const ContainerStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem",
  borderRadius: "0.5rem",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

function BugsFilters({ data, onChange }) {
  const availableFilters = useBugsAvailableFilters(
    data,
    FILTERS,
    renderFilterLabel
  );

  const [filters, setFilters] = useState({
    dsl: "",
    vulnerability: "",
    project: "",
    rootCause: "",
  });

  const handleFilterChange = useCallback(
    (field) => (event) => {
      const newFilters = { ...filters, [field]: event.target.value ?? "" };
      setFilters(newFilters);
      onChange?.(newFilters);
    },
    [filters, onChange]
  );

  return (
    <ContainerStyled>
      <FilterAltOutlined sx={{ stroke: "#e0e0e0" }} />
      <Select
        label="DSL"
        options={availableFilters.dsl}
        value={filters.dsl}
        onChange={handleFilterChange("dsl")}
      />
      <Select
        label="Project"
        options={availableFilters.project}
        value={filters.project}
        onChange={handleFilterChange("project")}
      />
      <Select
        label="Vulnerability"
        options={availableFilters.vulnerability}
        value={filters.vulnerability}
        onChange={handleFilterChange("vulnerability")}
      />
      <Select
        label="Root Cause"
        options={availableFilters.rootCause}
        value={filters.rootCause}
        onChange={handleFilterChange("rootCause")}
      />
    </ContainerStyled>
  );
}

export default BugsFilters;

BugsFilters.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dsl: PropTypes.string,
      impact: PropTypes.string,
      id: PropTypes.string,
      title: PropTypes.string,
      reproduced: PropTypes.bool,
      rootCause: PropTypes.string,
      vulnerability: PropTypes.string,
      similarBugs: PropTypes.arrayOf(PropTypes.string),
      source: PropTypes.shape({
        variant: PropTypes.string,
        variantName: PropTypes.string,
        sourceLink: PropTypes.string,
      }),
    })
  ),
  onChange: PropTypes.func,
};
