import { useMemo } from "react";
import PropTypes from "prop-types";
import { styled, Tab, Tabs } from "@mui/material";
import PieChart from "../charts/PieChart";
import { getOccuranciesPercentage } from "./chart-utils";
import ChartTabPanel from "./ChartTabPanel";
import PieChartInnerLabel from "../charts/PieChartInnerLabel";
import { useTabs } from "../../hooks/useTabs";
import { useBugsChartData } from "../../hooks/useBugsChartData";

const a11yProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const ContainerStyled = styled("div")(({ theme }) => ({
  "& .chart-wrapper": {
    border: `1px solid ${theme.palette.borders.default}`,
    borderTop: 0,
    borderBottomRightRadius: "0.5rem",
    borderBottomLeftRadius: "0.5rem",
    "& .chart": {
      width: "100%",
    },
  },
  "& .chart-tabs": {
    border: `1px solid ${theme.palette.borders.default}`,
    borderTopRightRadius: "0.5rem",
    borderTopLeftRadius: "0.5rem",
    backgroundColor: theme.palette.background.paper,
  },
}));

function ChartsSection({ data }) {
  const { tabValue, handleTabChange } = useTabs();

  const chartsData = useBugsChartData(data);

  const reproducedPercentage = useMemo(() => {
    const occuranciesPercentage = getOccuranciesPercentage(data, "reproduced");
    return occuranciesPercentage[true];
  }, [data]);

  const compiledPercentage = useMemo(() => {
    const occuranciesPercentage = getOccuranciesPercentage(
      data,
      "compiledDirect"
    );
    return occuranciesPercentage[true];
  }, [data]);

  return (
    <ContainerStyled>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        textColor="inherit"
        aria-label="full width tabs example"
        className="chart-tabs"
      >
        <Tab label="DSL" {...a11yProps(0)} />
        <Tab label="Vulnerability" {...a11yProps(1)} />
        <Tab label="Impact" {...a11yProps(2)} />
        <Tab label="Reproduced" {...a11yProps(3)} />
        <Tab label="Compiled" {...a11yProps(4)} />
        <Tab label="Root Cause" {...a11yProps(5)} />
      </Tabs>
      <div className="chart-wrapper">
        <ChartTabPanel value={tabValue} index={0}>
          <PieChart data={chartsData.dsl} className="chart" />
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={1}>
          <PieChart data={chartsData.vulnerability} className="chart" />
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={2}>
          <PieChart data={chartsData.impact} className="chart" />
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={3}>
          <PieChart
            data={chartsData.reproduced}
            innerRadius={80}
            className="chart"
          >
            <PieChartInnerLabel sx={{ fontSize: "28px" }}>
              {reproducedPercentage}
            </PieChartInnerLabel>
          </PieChart>
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={4}>
          <PieChart
            data={chartsData.compiled}
            innerRadius={80}
            className="chart"
          >
            <PieChartInnerLabel sx={{ fontSize: "28px" }}>
              {compiledPercentage}
            </PieChartInnerLabel>
          </PieChart>
        </ChartTabPanel>
        <ChartTabPanel value={tabValue} index={5}>
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
      compiledDirect: PropTypes.bool,
      compiledOriginal: PropTypes.bool,
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
