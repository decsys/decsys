import React from "react";
import * as math from "mathjs";
import Visualization, { plotlyVis } from "./components/Visualization";
import { getRadioParams, getRadios } from "./utils/radio-params";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const stats = (params, results) => {
  const radioValues = getRadios(getRadioParams(params)).map(
    (r) => r[0] || r[1]
  );
  const { values, indices } = results.reduce(
    (data, { value, index }) => {
      data.values.push(value);
      data.indices.push(index);
      return data;
    },
    { values: [], indices: [] }
  );
  return {
    visualizations: [
      {
        name: "Discrete Results",
        type: "custom",
        component: (
          <Visualization resultValues={values} radioValues={radioValues} />
        ),
      },
      {
        name: "Discrete Results Plotly",
        type: "plotly",
        plotly: plotlyVis(values, radioValues),
      },
    ],
    stats: {
      "Values - Mean, St.D": values.some((n) => isNaN(parseFloat(n)))
        ? "N/A"
        : `${fixed(math.mean, values)}, ${fixed(math.std, values)}`,
      "Index (from 0) - Mean, St.D": `${fixed(math.mean, indices)}, ${fixed(
        math.std,
        indices
      )}`,
    },
  };
};

export default stats;
