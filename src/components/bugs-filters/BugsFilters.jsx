import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Badge, Divider, styled } from "@mui/material";
import { FilterAltOutlined } from "@mui/icons-material";
import { useBugsAvailableFilters } from "../../hooks/useBugsAvailableFilters";
import { getTrimmedPathFromUrl } from "../../utils/transformations";
import Select from "../select/Select";

const FILTERS = ["dsl", "vulnerability", "project", "reproduced", "rootCause"];

const renderFilterLabel = (filter, value) => {
  if (filter === "project") {
    return getTrimmedPathFromUrl(value);
  }
  return value;
};

const ContainerStyled = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  overflowX: "auto",
  "& .filters-inputs-container": {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    overflowX: "auto",
  },
  "& .filter-input": {
    minWidth: "180px",
  },
});

const FilterBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    width: "1.25rem",
    height: "1.25rem",
    [theme.breakpoints.down("sm")]: {
      width: "1rem",
      height: "1rem",
    },
  },
}));
const FiltersIcon = styled(FilterAltOutlined)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "2rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

function BugsFilters({ data, className, onChange }) {
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
    reproduced: "",
  });

  const filtersApplied = useMemo(() => {
    return Object.values(filters).reduce((acc, value) => {
      if (value) {
        return [...acc, value];
      }
      return acc;
    }, []).length;
  }, [filters]);

  const handleFilterChange = useCallback(
    (field) => (event) => {
      const newFilters = { ...filters, [field]: event.target.value ?? "" };
      setFilters(newFilters);
      onChange?.(newFilters);
    },
    [filters, onChange]
  );

  return (
    <ContainerStyled className={className}>
      <FilterBadge badgeContent={filtersApplied} color="secondary">
        <FiltersIcon />
      </FilterBadge>
      <Divider orientation="vertical" flexItem sx={{ paddingLeft: "0.5rem" }} />
      <div className="filters-inputs-container">
        <Select
          label="DSL"
          options={availableFilters.dsl}
          value={filters.dsl}
          className="filter-input"
          onChange={handleFilterChange("dsl")}
        />
        <Select
          label="Project"
          options={availableFilters.project}
          value={filters.project}
          className="filter-input"
          onChange={handleFilterChange("project")}
        />
        <Select
          label="Vulnerability"
          options={availableFilters.vulnerability}
          value={filters.vulnerability}
          className="filter-input"
          onChange={handleFilterChange("vulnerability")}
        />
        <Select
          label="Root Cause"
          options={availableFilters.rootCause}
          value={filters.rootCause}
          className="filter-input"
          onChange={handleFilterChange("rootCause")}
        />
        <Select
          label="Reproduced"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
          value={filters.reproduced}
          className="filter-input"
          onChange={handleFilterChange("reproduced")}
        />
      </div>
    </ContainerStyled>
  );
}

export default BugsFilters;

BugsFilters.propTypes = {
  className: PropTypes.string,
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
