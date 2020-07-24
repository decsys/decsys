import React from "react";
import * as math from "mathjs";
import Visualization from "./components/Visualization";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const stats = (_, results) => {
  const wordCounts = results.map((x) => x.text.split(/\s+/).length);
  return {
    visualizations: [
      {
        name: "Word Cloud",
        component: <Visualization values={results} />,
      },
    ],
    stats: {
      ["Word Count - Min, Max"]: `${fixed(Math.min, ...wordCounts)}, ${fixed(
        Math.max,
        ...wordCounts
      )}`,
      ["Word Count - Mean"]: fixed(math.mean, wordCounts),
    },
  };
};

export default stats;
