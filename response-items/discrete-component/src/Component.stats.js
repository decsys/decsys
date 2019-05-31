import React from "react";
import * as math from "mathjs";
import Visualization from "./components/Visualization";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const stats = (_, results) => {
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
        component: <Visualization values={values} />
      }
    ],
    stats: {
      ["Values - Mean, STD"]: values.some(n => isNaN(parseFloat(n)))
        ? "N/A"
        : `${fixed(math.mean, values)}, ${fixed(math.std, values)}`,
      ["Index (from 0) - Mean, STD"]: `${fixed(math.mean, indices)}, ${fixed(
        math.std,
        indices
      )}`
    }
  };
};

export default stats;
