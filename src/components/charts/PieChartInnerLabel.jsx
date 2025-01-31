import PropTypes from "prop-types";
import { styled } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieChartInnerLabelUnstyled({ children, className }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2} className={className}>
      {children}
    </StyledText>
  );
}

const PieChartInnerLabel = styled(PieChartInnerLabelUnstyled)({});
export default PieChartInnerLabel;

PieChartInnerLabelUnstyled.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
