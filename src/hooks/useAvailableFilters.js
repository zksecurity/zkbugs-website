const getAvailableFilters = (data = [], filterFields = [], renderLabel) => {
  const filtersSets = {};

  // Create a set for each filter
  data.forEach((bug) => {
    filterFields.forEach((filter) => {
      if (!filtersSets[filter]) {
        filtersSets[filter] = new Set();
      }
      filtersSets[filter].add(bug[filter]);
    });
  });

  const filters = {};

  // Convert sets to options arrays and sort alphabetically by label
  Object.entries(filtersSets).forEach(([filter, valuesSet]) => {
    const options = Array.from(valuesSet)
      .filter((v) => v !== undefined && v !== null && v !== "")
      .map((value) => ({
        value,
        label: renderLabel ? renderLabel(filter, value) : value,
      }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label), undefined, { sensitivity: "base" }));

    filters[filter] = options;
  });

  return filters;
};

export const useAvailableFilters = (
  data = [],
  filterFields = [],
  renderLabel
) => {
  const filters = getAvailableFilters(data, filterFields, renderLabel);

  return filters;
};
