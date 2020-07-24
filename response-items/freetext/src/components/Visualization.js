import React, { useRef, useState, useMemo, useEffect } from "react";
import ReactWordCloud from "react-wordcloud";
import transition from "d3-transition";

const Visualization = ({ values }) => {
  const previous = useRef(values);
  const [results, setResults] = useState(values);
  useEffect(() => {
    if (JSON.stringify(previous.current) !== JSON.stringify(values)) {
      previous.current = values;
      setResults(values);
    }
  }, [values]);

  const wordCloud = useMemo(() => {
    // a value is the whole freetext value submitted
    const weightedWords = results.reduce((a, { text }) => {
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
  }, [results]);

  return wordCloud;
};

export default Visualization;
