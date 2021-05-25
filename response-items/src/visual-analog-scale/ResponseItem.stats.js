import * as math from "mathjs";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

export const stats = (_, results) => {
  const values = results.map((r) => r.value);

  return {
    stats: {
      "Values - Mean, St.D": values.some((n) => isNaN(parseFloat(n)))
        ? "N/A"
        : `${fixed(math.mean, values)}, ${fixed(math.std, values)}`,
    },
  };
};
