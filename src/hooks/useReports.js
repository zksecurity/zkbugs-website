import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.fetchReports().then((data) => {
      setReports(data);
    });
  }, []);

  return reports;
};
