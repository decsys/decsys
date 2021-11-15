export const getScrolledY = (y) => y + window.pageYOffset;

export const getBounds = (bar) => {
  const bounds = bar.getBoundingClientRect();
  // Handle MS ClientRect since even Classic Edge is non-standard >.<
  if (bounds.x == null) bounds.x = bounds.left;
  if (bounds.y == null) bounds.y = bounds.top;

  return bounds;
};

/**
 * Convert an absolute x co-ordinate to a value on the ScaleBar
 * @public
 * @param {number} x the absolute x co-ordinate
 * @returns {number} The converted value
 */
export const getValueForX = (x, minValue, maxValue, bar) => {
  const relativeX = getRelativeXPos(x, bar);
  return getValueForRelativeX(relativeX, minValue, maxValue, bar);
};

export const getValueForRelativeX = (x, minValue, maxValue, bar) => {
  const { width } = getBounds(bar);
  return (maxValue - minValue) * (x / width) + minValue;
};

/**
 * Convert a value on the bar back to a relative x co-ordinate
 * @public
 * @param {number} value the value to convert
 * @returns {number} The relative x co-ordinate
 */
export const getXPosForValue = (
  value,
  minValue,
  maxValue,
  bar,
  hasRawBounds = false
) => {
  const barBounds = hasRawBounds ? bar : getBounds(bar);

  // get value as a ratio of absolute bar range
  const adjustedValue = value - minValue;
  const absBarMax = maxValue - minValue;
  const valueRatio = adjustedValue / absBarMax;

  // apply the ratio to the relative max co-ord
  return barBounds.width * valueRatio;
};

/**
 * Convert an absolute (whole page) x value
 * to a bar relative one, clamping to the
 * ends of the bar
 * @public
 * @param {number} absX the absolute x co-ordinate
 * @returns {number} The relative x co-ordinate
 */
export const getRelativeXPos = (absX, bar) => {
  const { x, right, width } = getBounds(bar);
  return absX <= x // clamp results to the bar bounds, else adjust the offset
    ? 0
    : absX >= right
    ? width
    : absX - x;
};
