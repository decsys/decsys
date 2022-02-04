import * as math from "mathjs";
import IntervalAgreementApproach from "@decsys/iaa";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const getPlotlyProps = (iaa, minMax) => {

  const reducer = (data, x) => {
    const y = iaa.membership(x) * 100;

    return {
      x: [...data.x, x],
      y: [...data.y, y],
    };
  };

  let data = iaa.intervals.singletonKeys
    .sort((x1, x2) => x1 - x2)
    .reduce(reducer, { x: [], y: [] });

  const newData = { ...JSON.parse(JSON.stringify(data)) }
  let prev = data.y[0]
  let added = 0
  for (let i = 1; i < data.y.length; i++) {
    const current = data.y[i]
    if (current < prev) {
      newData.x.splice(i + added, 0, data.x[i - 1])
      newData.y.splice(i + added, 0, data.y[i])
      added++
    }
    prev = current
  }

  if (newData.y[0] != 0) {
    newData.x = [newData.x[0], ...newData.x]
    newData.y = [0, ...newData.y]
  }
  if (newData.y[newData.y.length - 1] != 0) {
    newData.x = [...newData.x, newData.x[newData.y.length - 1]]
    newData.y = [...newData.y, 0]
  }
  data = { ...newData }
  const maxY = Math.max(...data.y);
  const centroidValue = iaa.centroid;
  const mean_of_midpoints = iaa.mean_of_midpoints
  const mean_of_maxima = iaa.mean_of_maxima
  const dataTrace = {
    x: data.x,
    y: data.y,
    mode: "lines+markers",
    line: { shape: "hv" },
    type: "scatter",
    name: "Intervals",
  };

  const centroidTrace = {
    x: [centroidValue, centroidValue],
    y: [0, maxY],
    name: "Centroid",
  };

  const mean_of_midpoints_trace = {
    x: [mean_of_midpoints, mean_of_midpoints],
    y: [0, maxY],
    name: "Mean of Midpoints",
  };

  const mean_of_maxima_trace = {
    x: [mean_of_maxima, mean_of_maxima],
    y: [0, maxY],
    name: "Mean of Maxima",
  };

  return {
    data: [dataTrace, centroidTrace,mean_of_midpoints_trace,mean_of_maxima_trace],
    layout: {
      xaxis: { zeroline: false, title: "Scale Value", range: minMax ? [minMax.min - 5, minMax.max + 5] : null },
      yaxis: { zeroline: false, title: "% Participants", range: minMax ? [minMax.min - 5, minMax.max + 5] : null },
    },
  };
};

export const stats = (_, results) => {
  // break down the results in a bunch of different useful ways...
  const reducer = (a, { minRangeValue: min, maxRangeValue: max }) => {
    a.values.push([min, max]);
    a.minValues.push(min);
    a.maxValues.push(max);
    a.intervalWidths.push(max - min);
    return a;
  };
  const { values, intervalWidths, minValues, maxValues } = results.reduce(
    reducer,
    {
      values: [],
      intervalWidths: [],
      minValues: [],
      maxValues: [],
    }
  );
  const iaa = new IntervalAgreementApproach();
  for (const interval of values) iaa.addInterval(interval);
  const centroidValue = iaa.centroid;
  const mean_of_midpoints = iaa.mean_of_midpoints
  const mean_of_maxima = iaa.mean_of_maxima

  return {
    visualizations: [
      {
        name: "Ellipse Results",
        type: "plotly",
        plotly: getPlotlyProps(iaa, { min: _.barMinValue, max: _.barMaxValue }),
      },
    ],
    stats: {
      "Left Endpoint - Mean, St.D": `${fixed(math.mean, minValues)}, ${fixed(
        math.std,
        minValues
      )}`,
      "Right Endpoint - Mean, St.D": `${fixed(math.mean, maxValues)}, ${fixed(
        math.std,
        maxValues
      )}`,
      "Size - Mean, St.D": `${fixed(math.mean, intervalWidths)}, ${fixed(
        math.std,
        intervalWidths
      )}`,
      "Response - Min, Max": `${fixed(Math.min, ...minValues)}, ${fixed(
        Math.max,
        ...maxValues
      )}`,
      Centroid: fixed((args) => args, centroidValue),
      "Mean of Midpoints": fixed((args) => args, mean_of_midpoints),
      "Mean of Maxima": fixed((args) => args, mean_of_maxima),
    },
  };
};
