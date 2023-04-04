import * as math from "mathjs";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const getWordcloudProps = (values) => {
  // a value is the whole freetext value submitted
  const weightedWords = values.reduce((a, { text }) => {
    // split the text into single words
    const words = text?.split(/\s+/) ?? [];

    words.forEach((w) => {
      const word = w.toLowerCase();
      a[word] = (a[word] || 0) + 1;
    });

    return a;
  }, {});

  const words = Object.keys(weightedWords).map((text) => ({
    text,
    value: weightedWords[text],
  }));

  return {
    options: {
      rotations: 0,
      fontFamily: "Arial",
      fontSizes: [10, 60],
      scale: "sqrt",
    },
    words,
  };
};

export const stats = (_, results) => {
  const wordCounts = results.map((x) => x.text?.split(/\s+/).length ?? 0);
  return {
    visualizations: [
      {
        name: "Word Cloud",
        type: "wordcloud",
        wordcloud: getWordcloudProps(results),
      },
    ],
    stats: {
      "Word Count - Min, Max": `${fixed(Math.min, ...wordCounts)}, ${fixed(
        Math.max,
        ...wordCounts
      )}`,
      "Word Count - Mean": fixed(math.mean, wordCounts),
    },
  };
};
