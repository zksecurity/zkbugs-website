import { PieChart as MuiPieChart } from "@mui/x-charts";
import PropTypes from "prop-types";

const pieParams = {
  height: 300,
};

function PieChart({
  data,
  colors,
  innerRadius = 8,
  outerRadius = 100,
  width,
  children,
  className,
}) {
  const finalPieParams = width ? { ...pieParams, width } : pieParams;
  return (
    <MuiPieChart
      colors={colors}
      series={[
        {
          data,
          highlightScope: { fade: "global", highlight: "item" },
          // valueFormatter,
          innerRadius,
          outerRadius,
          paddingAngle: 2,
          cornerRadius: 4,
        },
      ]}
      {...finalPieParams}
      className={className}
    >
      {children}
    </MuiPieChart>
  );
}

export default PieChart;

PieChart.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ).isRequired,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  width: PropTypes.number,
};
