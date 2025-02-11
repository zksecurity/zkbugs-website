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

  // Convert sets to options arrays
  Object.entries(filtersSets).forEach(([filter, valuesSet]) => {
    filters[filter] = Array.from(valuesSet).map((value) => ({
      value,
      label: renderLabel ? renderLabel(filter, value) : value,
    }));
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
