import React from "react";
import * as math from "mathjs";
import Visualization from "./components/Visualization";

const stats = (_, results) => {
  const wordCounts = results.map(x => x.text.split(/\s+/).length);
  return {
    visualizations: [
      {
        name: "Word Cloud",
        component: <Visualization values={results} />
      }
    ],
    stats: {
      ["Mean Word Count"]: math.mean(wordCounts),
      ["Shortest Word Count"]: Math.min(...wordCounts),
      ["Longest Word Count"]: Math.max(...wordCounts)
    }
  };
};

export default stats;
