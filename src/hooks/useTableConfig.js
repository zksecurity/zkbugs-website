import { useEffect, useState } from "react";
import { api } from "../api/api";
import { getColumnsConfig } from "../utils/tableConfig";

const useTableConfig = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.fetchBugs().then((data) => {
      const config = getColumnsConfig(data);
      setColumns(config);
      setRows(data);
    });
  }, []);

  return { rows, columns };
};

export default useTableConfig;
