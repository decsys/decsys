export const capitalise = (s) =>
  s
    .split("")
    .map((x, i) => (i ? x : x.toUpperCase()))
    .join("");
