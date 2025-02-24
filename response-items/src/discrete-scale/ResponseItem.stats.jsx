import * as math from "mathjs";
import { getRadioParams, getRadios } from "./utils/radio-params";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const getPlotlyProps = (resultValues, radioValues) => {
  const aggregate = resultValues.reduce((agg, v) => {
    agg[v] = (agg[v] || 0) + 1;
    return agg;
  }, {});
  const data = radioValues.map((x) => ({ x, y: aggregate[x] || 0 }));

  return {
    data: [{ type: "bar", x: data.map((d) => d.x), y: data.map((d) => d.y) }],
    layout: {
      xaxis: { zeroline: false, title: "Discrete Value" },
      yaxis: { zeroline: false, title: "Participants" },
    },
  };
};

export const stats = (params, results) => {
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
        type: "plotly",
        plotly: getPlotlyProps(values, radioValues),
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
