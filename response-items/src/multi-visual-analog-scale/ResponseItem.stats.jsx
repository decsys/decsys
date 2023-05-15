import * as math from "mathjs";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

export const stats = (_, results) => {
  const reducer = (a, { left, right, bestEstimate, confidence }) => {
    a.lefts.push(left);
    a.rights.push(right);
    a.bestimates.push(bestEstimate);
    a.confidences.push(confidence);
    return a;
  };
  const { lefts, rights, bestimates, confidences } = results.reduce(reducer, {
    lefts: [],
    rights: [],
    bestimates: [],
    confidences: [],
  });

  return {
    stats: {
      "Left Values - Mean, St.D": lefts.some((n) => isNaN(parseFloat(n)))
        ? "N/A"
        : `${fixed(math.mean, lefts)}, ${fixed(math.std, lefts)}`,
      "Right Values - Mean, St.D": rights.some((n) => isNaN(parseFloat(n)))
        ? "N/A"
        : `${fixed(math.mean, rights)}, ${fixed(math.std, rights)}`,
      "Best Estimate Values - Mean, St.D": bestimates.some((n) =>
        isNaN(parseFloat(n))
      )
        ? "N/A"
        : `${fixed(math.mean, bestimates)}, ${fixed(math.std, bestimates)}`,
      "Confidence Percentage - Mean, St.D": confidences.some((n) =>
        isNaN(parseFloat(n))
      )
        ? "N/A"
        : `${fixed(math.mean, confidences)}, ${fixed(math.std, confidences)}`,
    },
  };
};
