import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { styled, Tab, Tabs } from "@mui/material";
import PieChart from "../charts/PieChart";
import { getChartData, getOccuranciesPercentage } from "./chart-utils";
import ChartTabPanel from "./ChartTabPanel";
import PieChartInnerLabel from "../charts/PieChartInnerLabel";
import { useTabs } from "../../hooks/useTabs";

const a11yProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const ContainerStyled = styled("div")({
  "& .chart-wrapper": {
    border: "1px solid #e0e0e0",
    borderTop: 0,
    borderBottomRightRadius: "0.25rem",
    borderBottomLeftRadius: "0.25rem",
    "& .chart": {
      width: "100%",
    },
  },
  "& .chart-tabs": {
    border: "1px solid #e0e0e0",
    borderTopRightRadius: "0.25rem",
    borderTopLeftRadius: "0.25rem",
  },
});

function ChartsSection({ data }) {
  const [chartsData, setChartsData] = useState({
    dsl: [],
    vulnerability: [],
    impact: [],
    reproduced: [],
    rootCause: [],
  });
  const { tabValue, handleTabChange } = useTabs();

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

  const reproducedPercentage = useMemo(() => {
    const occuranciesPercentage = getOccuranciesPercentage(data, "reproduced");
    return occuranciesPercentage[true];
  }, [data]);

  return (
    <ContainerStyled>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="secondary"
        variant="scrollable"
        textColor="inherit"
        aria-label="full width tabs example"
        className="chart-tabs"
      >
        <Tab label="DSL" {...a11yProps(0)} />
        <Tab label="Vulnerability" {...a11yProps(1)} />
        <Tab label="Impact" {...a11yProps(2)} />
        <Tab label="Reproduced" {...a11yProps(2)} />
        <Tab label="Root Cause" {...a11yProps(2)} />
      </Tabs>
      <div className="chart-wrapper">
        <ChartTabPanel value={tabValue} index={0}>
          <PieChart data={chartsData.dsl} width={500} className="chart" />
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={1}>
          <PieChart
            data={chartsData.vulnerability}
            width={500}
            className="chart"
          />
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={2}>
          <PieChart data={chartsData.impact} width={500} className="chart" />
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={3}>
          <PieChart
            data={chartsData.reproduced}
            width={500}
            innerRadius={80}
            className="chart"
          >
            <PieChartInnerLabel sx={{ fontSize: "28px" }}>
              {reproducedPercentage}
            </PieChartInnerLabel>
          </PieChart>
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={4}>
          <PieChart data={chartsData.rootCause} className="chart" />
        </ChartTabPanel>
      </div>
    </ContainerStyled>
  );
}

export default ChartsSection;

ChartsSection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dsl: PropTypes.string,
      impact: PropTypes.string,
      id: PropTypes.string,
      title: PropTypes.string,
      reproduced: PropTypes.bool,
      rootCause: PropTypes.string,
      vulnerability: PropTypes.string,
      similarBugs: PropTypes.arrayOf(PropTypes.string),
      source: PropTypes.shape({
        variant: PropTypes.string,
        variantName: PropTypes.string,
        sourceLink: PropTypes.string,
      }),
    })
  ),
};
