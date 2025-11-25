import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, Divider, FormControlLabel } from "@mui/material";
import { useAvailableFilters } from "../../hooks/useAvailableFilters";
import { getTrimmedPathFromUrl } from "../../utils/transformations";
import Select from "../select/Select";
import {
  ContainerStyled,
  FilterBadge,
  FiltersIcon,
} from "./FiltersCommonComponents";

const FILTERS = ["dsl", "vulnerability", "project", "reproduced", "rootCause"];

const renderFilterLabel = (filter, value) => {
  if (filter === "project") {
    return getTrimmedPathFromUrl(value);
  }
  return value;
};

function BugsFilters({ data, className, onChange }) {
  const availableFilters = useAvailableFilters(
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
    zkvm: "",
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

  const handleZkvmToggle = useCallback(
    (event) => {
      const newFilters = { ...filters, zkvm: event.target.checked ? "true" : "" };
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
        <FormControlLabel
          control={<Checkbox checked={filters.zkvm === "true"} onChange={handleZkvmToggle} />}
          label="Only zkVM"
          className="filter-input"
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
      zkvm: PropTypes.bool,
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
