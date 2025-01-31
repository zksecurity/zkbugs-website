import { useCallback, useEffect, useState } from "react";

const getFilteredFields = (filters = {}) => {
  return Object.keys(filters).filter((filter) => filters[filter] !== "");
};

export const useFilteredBugs = (bugsData = []) => {
  const [filteredBugs, setFilteredBugs] = useState(bugsData);

  useEffect(() => {
    setFilteredBugs(bugsData);
  }, [bugsData]);

  const updateFilters = useCallback(
    (filters) => {
      const filteredFields = getFilteredFields(filters);
      console.log(filteredFields);

      const newFilteredBugs = bugsData.filter((bug) => {
        return filteredFields.every((field) => {
          return bug[field] === filters[field];
        });
      });

      setFilteredBugs(newFilteredBugs);
    },
    [bugsData]
  );

  return { filteredBugs, updateFilters };
};
