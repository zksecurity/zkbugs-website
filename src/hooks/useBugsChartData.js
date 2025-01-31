import { useEffect, useState } from "react";
import { getChartData } from "../components/charts-section/chart-utils";

export const useBugsChartData = (data) => {
  const [chartsData, setChartsData] = useState({
    dsl: [],
    vulnerability: [],
    impact: [],
    reproduced: [],
    rootCause: [],
  });

  useEffect(() => {
    setChartsData({
      dsl: getChartData(data, "dsl"),
      vulnerability: getChartData(data, "vulnerability"),
      impact: getChartData(data, "impact"),
      reproduced: getChartData(data, "reproduced", {
        true: "Reproduced",
        false: "Not Reproduced",
      }),
      rootCause: getChartData(data, "rootCause"),
    });
  }, [data]);

  return chartsData;
};
