import React, { memo } from "react";
import ReactWordCloud from "react-wordcloud";

const Visualization = memo(
  ({ values }) => {
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

    const data = Object.keys(weightedWords).map((text) => ({
      text,
      value: weightedWords[text],
    }));

    return (
      <ReactWordCloud
        options={{
          rotations: 0,
          fontFamily: "Arial",
          fontSizes: [10, 60],
          scale: "sqrt",
        }}
        words={data}
      />
    );
  },
  ({ values: oldValues }, { values }) =>
    JSON.stringify(oldValues) === JSON.stringify(values)
);

export default Visualization;
