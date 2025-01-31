import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useBugs = () => {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    api.fetchBugs().then((data) => {
      setBugs(data);
    });
  }, []);

  return bugs;
};
