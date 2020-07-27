import React from "react";
import * as math from "mathjs";
import IntervalAgreementApproach from "@decsys/iaa";
import Visualization from "./components/Visualization";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const stats = (params, results) => {
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
        component: <Visualization {...params} iaa={iaa} />,
      },
    ],
    stats: {
      ["Left Endpoint - Mean, St.D"]: `${fixed(math.mean, minValues)}, ${fixed(
        math.std,
        minValues
      )}`,
      ["Right Endpoint - Mean, St.D"]: `${fixed(math.mean, maxValues)}, ${fixed(
        math.std,
        maxValues
      )}`,
      ["Size - Mean, St.D"]: `${fixed(math.mean, intervalWidths)}, ${fixed(
        math.std,
        intervalWidths
      )}`,
      ["Response - Min, Max"]: `${fixed(Math.min, ...minValues)}, ${fixed(
        Math.max,
        ...maxValues
      )}`,
      ["Centroid"]: fixed((args) => args, centroidValue),
    },
  };
};

export default stats;
