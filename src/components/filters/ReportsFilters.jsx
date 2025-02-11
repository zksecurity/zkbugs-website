import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Divider } from "@mui/material";
import { useAvailableFilters } from "../../hooks/useAvailableFilters";
import { getTrimmedPathFromUrl } from "../../utils/transformations";
import Select from "../select/Select";
import {
  ContainerStyled,
  FilterBadge,
  FiltersIcon,
} from "./FiltersCommonComponents";

const FILTERS = ["dsl", "project", "auditor"];

const renderFilterLabel = (filter, value) => {
  if (filter === "project") {
    return getTrimmedPathFromUrl(value);
  }
  return value;
};

function ReportsFilters({ data, className, onChange }) {
  const availableFilters = useAvailableFilters(
    data,
    FILTERS,
    renderFilterLabel
  );

  const [filters, setFilters] = useState({
    dsl: "",
    project: "",
    auditor: "",
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
          label="Auditor"
          options={availableFilters.auditor}
          value={filters.auditor}
          className="filter-input"
          onChange={handleFilterChange("auditor")}
        />
      </div>
    </ContainerStyled>
  );
}

export default ReportsFilters;

ReportsFilters.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      auditor: PropTypes.string,
      dsl: PropTypes.string,
      file: PropTypes.string,
      id: PropTypes.string,
      project: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};
