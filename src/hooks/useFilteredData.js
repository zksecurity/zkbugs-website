import { useCallback, useEffect, useState } from "react";

const getFilteredFields = (filters = {}) => {
  return Object.keys(filters).filter((filter) => filters[filter] !== "");
};

export const useFilteredData = (bugsData = []) => {
  const [filteredData, setFilteredData] = useState(bugsData);

  useEffect(() => {
    setFilteredData(bugsData);
  }, [bugsData]);

  const updateFilters = useCallback(
    (filters) => {
      const filteredFields = getFilteredFields(filters);

      const newFilteredData = bugsData.filter((bug) => {
        return filteredFields.every((field) => {
          const bugFiledStringValue = String(bug[field]);
          return bugFiledStringValue === filters[field];
        });
      });

      setFilteredData(newFilteredData);
    },
    [bugsData]
  );

  return { filteredData, updateFilters };
};
