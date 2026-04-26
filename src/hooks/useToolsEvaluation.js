import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useToolsEvaluation = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.fetchToolsEvaluation().then((value) => {
      if (!cancelled) setData(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
};
