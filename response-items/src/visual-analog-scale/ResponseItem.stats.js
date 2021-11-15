import * as math from "mathjs";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

export const stats = (_, results) => {
  const reducer = (a, { value, confidence }) => {
    a.values.push(value);
    a.confidences.push(confidence);
    return a;
  };
  const { values, confidences } = results.reduce(reducer, {
    values: [],
    confidences: [],
  });

  return {
    stats: {
      "Values - Mean, St.D": values.some((n) => isNaN(parseFloat(n)))
        ? "N/A"
        : `${fixed(math.mean, values)}, ${fixed(math.std, values)}`,
      "Confidence Percentage - Mean, St.D": confidences.some((n) =>
        isNaN(parseFloat(n))
      )
        ? "N/A"
        : `${fixed(math.mean, confidences)}, ${fixed(math.std, confidences)}`,
    },
  };
};
