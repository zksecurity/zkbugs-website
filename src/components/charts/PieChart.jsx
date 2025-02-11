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

    // Split the label into words
    const labelWords = item.label.split(" ");

    // Apply new lines to the label
    const firstWord = labelWords.shift();
    const mergedWords = mergeWords(firstWord, labelWords, trimPoint);

    return {
      ...item,
      label: mergedWords,
    };
  });
};

const HEIGHT_PER_ITEM = 48;
const MIN_HEIGHT_WEB = 500;
const MIN_HEIGHT_MOBILE = 300;

const adjustHeight = (data, isMobile) => {
  const height = data.length * HEIGHT_PER_ITEM + 50;
  const minHeight = isMobile ? MIN_HEIGHT_MOBILE : MIN_HEIGHT_WEB;
  if (height > minHeight) {
    return height;
  }
  return minHeight;
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
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const finalData = useMemo(() => {
    if (isSmallScreen) {
      return trimLongLengends(data, 18);
    }
    return trimLongLengends(data, 30);
  }, [data, isSmallScreen]);

  const finalHeight = useMemo(() => {
    return adjustHeight(data, isMobile);
  }, [data, isMobile]);

  const finalPieParams = useMemo(() => {
    const pieParams = { height: finalHeight };
    if (isSmallScreen) {
      return { ...pieParams, width: 500 };
    }
    if (width) {
      return { ...pieParams, width };
    }
    return pieParams;
  }, [isSmallScreen, width, finalHeight]);

  return (
    <MuiPieChart
      colors={colors}
      series={[
        {
          data: finalData,
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
