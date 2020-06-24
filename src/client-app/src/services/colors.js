export const hexToRgb = hex => {
  hex = hex.replace("#", ""); // remove hash
  // pad shorthand hex strings like #fff
  if (hex.length < 6)
    hex = hex
      .split()
      .map(c => `${c}${c}`)
      .join("");
  return [0, 2, 4].map(p => parseInt(hex.substr(p, 2), 16));
};

export const getContrastYIQ = hex => {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128;
};

export const getContrastColor = (color, onLight = "black", onDark = "white") =>
  getContrastYIQ(color) ? onLight : onDark;
