import { useMemo } from "react";
import PropTypes from "prop-types";
import { PieChart as MuiPieChart } from "@mui/x-charts";
import { useMediaQuery } from "@mui/material";

const pieParams = {
  height: 300,
};

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

const trimLongLengends = (data) => {
  return data.map((item) => {
    if (!item.label) return item;

    if (item.label.length <= 18) {
      return item;
    }

    // Split the label into words
    const labelWords = item.label.split(" ");

    // Apply new lines to the label
    const firstWord = labelWords.shift();
    const mergedWords = mergeWords(firstWord, labelWords, 18);

    return {
      ...item,
      label: mergedWords,
    };
  });
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

  const finalData = useMemo(() => {
    if (isSmallScreen) {
      return trimLongLengends(data);
    }
    return data;
  }, [data, isSmallScreen]);

  const finalPieParams = useMemo(() => {
    if (isSmallScreen) {
      return { ...pieParams, width: 500 };
    }
    if (width) {
      return { ...pieParams, width };
    }
    return pieParams;
  }, [isSmallScreen, width]);

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
