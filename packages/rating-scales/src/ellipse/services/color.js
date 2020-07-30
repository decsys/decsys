import nameToHexString from "colornames";

/** Utility functions for working with colors */

/**
 * Get a numeric value representing the RGB value of a supported color
 *
 * @param {string|number} input
 * The color, either by CSS friendly name (e.g. `red`)
 * or RGB Hex code (e.g. `#ff0000`)
 *
 * If a number, simply returns it rather than errorring
 * @returns {number} The color as a number value
 * which hexadecimally would look like `0xRRGGBB`
 */
export const getNumber = (input) => {
  if (typeof input === "number") return input;

  if (typeof input !== "string")
    throw new TypeError(
      "String expected, either a CSS color name or RGB Hex code."
    );

  if (!input.startsWith("#")) {
    input = getHexString(input);
  }

  if (!input) return;

  const result = parseInt(input.substring(1), 16);
  return !Number.isNaN(result) ? result : undefined;
};

/**
 * Get an RGB Hex code for a supported color name
 *
 * @param {string} input
 * The color, by CSS friendly name (e.g. `red`)
 *
 * @returns {string} The color as an RGB Hex code (e.g. `#ff0000`)
 */
export const getHexString = (input) => {
  if (typeof input !== "string") throw new TypeError("CSS color name expected");
  return nameToHexString(input);
};
