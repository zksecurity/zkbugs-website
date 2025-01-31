import { useCallback, useState } from "react";

export const useTabs = (initialIndex = 0) => {
  const [value, setValue] = useState(initialIndex);
  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  return { tabValue: value, handleTabChange: handleChange };
};
