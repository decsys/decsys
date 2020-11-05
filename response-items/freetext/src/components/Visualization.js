import React from "react";
import ReactWordCloud from "react-wordcloud";

export const builtIn = (values) => ({
  options: {
    rotations: 0,
    fontFamily: "Arial",
    fontSizes: [10, 60],
    scale: "sqrt",
  },
  words: visData(values),
});

const visData = (values) => {
  // a value is the whole freetext value submitted
  const weightedWords = values.reduce((a, { text }) => {
    // split the text into single words
    const words = text.split(/\s+/);

    words.forEach((w) => {
      const word = w.toLowerCase();
      a[word] = (a[word] || 0) + 1;
    });

    return a;
  }, {});

  return Object.keys(weightedWords).map((text) => ({
    text,
    value: weightedWords[text],
  }));
};

const Visualization = ({ values }) => {
  return <ReactWordCloud {...builtIn(values)} />;
};

export default Visualization;
