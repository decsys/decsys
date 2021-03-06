import * as math from "mathjs";
import IntervalAgreementApproach from "@decsys/iaa";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const getPlotlyProps = (iaa) => {
  const reducer = (data, x) => {
    const y = iaa.membership(x) * 100;

    return {
      x: [...data.x, x],
      y: [...data.y, y],
    };
  };

  const data = iaa.intervals.singletonKeys
    .sort((x1, x2) => x1 - x2)
    .reduce(reducer, { x: [], y: [] });

  const maxY = Math.max(...data.y);
  const centroidValue = iaa.centroid;

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

  return {
    data: [dataTrace, centroidTrace],
    layout: {
      xaxis: { zeroline: false, title: "Scale Value" },
      yaxis: { zeroline: false, title: "% Participants" },
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

  return {
    visualizations: [
      {
        name: "Ellipse Results",
        type: "plotly",
        plotly: getPlotlyProps(iaa),
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
    },
  };
};
