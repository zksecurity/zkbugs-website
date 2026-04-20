import { useMemo } from "react";
import PropTypes from "prop-types";
import { PieChart as MuiPieChart } from "@mui/x-charts";
import { useMediaQuery } from "@mui/material";

const mergeWords = (currentWord, words, maxChars) => {
  const wordsCopy = [...words];
  const nextWord = wordsCopy.shift();

  if (!nextWord) {
    return currentWord;
  }

  if (currentWord.length + nextWord.length > maxChars) {
    return currentWord + "\n" + mergeWords(nextWord, wordsCopy, maxChars);
  }

  return mergeWords(`${currentWord} ${nextWord}`, wordsCopy, maxChars);
};

const trimLongLengends = (data, trimPoint) => {
  return data.map((item) => {
    if (!item.label) return item;

    if (item.label.length <= trimPoint) {
      return item;
    }

    const labelWords = item.label.split(" ");

    const firstWord = labelWords.shift();
    const mergedWords = mergeWords(firstWord, labelWords, trimPoint);

    return {
      ...item,
      label: mergedWords,
    };
  });
};

const HEIGHT_PER_ITEM = 32;
const MIN_HEIGHT_WEB = 420;
const MIN_HEIGHT_MOBILE = 360;

const DEFAULT_WIDTH = 640;
const MOBILE_WIDTH = 480;
const LEGEND_RESERVE_RIGHT = 220;
const LEGEND_RESERVE_BOTTOM = 120;

const adjustHeight = (data, isMobile) => {
  const computed = data.length * HEIGHT_PER_ITEM + 120;
  const minHeight = isMobile ? MIN_HEIGHT_MOBILE : MIN_HEIGHT_WEB;
  return Math.max(minHeight, computed);
};

function PieChart({
  data,
  colors,
  innerRadius = 8,
  outerRadius = 110,
  width,
  children,
  className,
}) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const finalData = useMemo(() => {
    const trim = isSmallScreen ? 18 : 30;
    return trimLongLengends(data, trim);
  }, [data, isSmallScreen]);

  const finalHeight = useMemo(
    () => adjustHeight(data, isMobile),
    [data, isMobile]
  );

  const finalWidth = useMemo(() => {
    if (isMobile) return MOBILE_WIDTH;
    if (width) return width;
    return DEFAULT_WIDTH;
  }, [isMobile, width]);

  const margin = useMemo(() => {
    if (isMobile) {
      return { top: 16, right: 16, bottom: LEGEND_RESERVE_BOTTOM, left: 16 };
    }
    return { top: 24, right: LEGEND_RESERVE_RIGHT, bottom: 24, left: 24 };
  }, [isMobile]);

  const slotProps = useMemo(
    () => ({
      legend: {
        direction: isMobile ? "row" : "column",
        position: isMobile
          ? { vertical: "bottom", horizontal: "middle" }
          : { vertical: "middle", horizontal: "right" },
        itemMarkWidth: 14,
        itemMarkHeight: 14,
        itemGap: 10,
        labelStyle: { fontSize: 14 },
      },
    }),
    [isMobile]
  );

  return (
    <MuiPieChart
      colors={colors}
      series={[
        {
          data: finalData,
          highlightScope: { fade: "global", highlight: "item" },
          innerRadius,
          outerRadius,
          paddingAngle: 2,
          cornerRadius: 4,
        },
      ]}
      width={finalWidth}
      height={finalHeight}
      margin={margin}
      slotProps={slotProps}
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
