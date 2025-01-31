const countOccurancies = (dataArray, key) => {
  const occurancies = {};

  dataArray.forEach((item) => {
    const value = item[key];
    if (value == null) {
      return;
    }
    occurancies[value] = occurancies[value] + 1 || 1;
  });

  return occurancies;
};

const occuranciesToChartData = (occurancies, labelMap) => {
  return Object.entries(occurancies).map(([key, value]) => ({
    label: labelMap ? labelMap[key] : key,
    value,
  }));
};

export const getChartData = (data, key, labelMap) => {
  const occurancies = countOccurancies(data, key);
  return occuranciesToChartData(occurancies, labelMap);
};

export const getOccuranciesPercentage = (dataArray, key) => {
  const occurancies = countOccurancies(dataArray, key);
  const total = Object.values(occurancies).reduce(
    (acc, value) => acc + value,
    0
  );
  const occuranciesPercentage = {};
  Object.entries(occurancies).forEach(([key, value]) => {
    occuranciesPercentage[key] = ((value / total) * 100).toFixed(2) + "%";
  });
  return occuranciesPercentage;
};
