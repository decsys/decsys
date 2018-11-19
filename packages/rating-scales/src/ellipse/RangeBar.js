import React from "react";
import PropTypes from "prop-types";
import ScaleBar, { ClassName } from "../core/StyledScaleBar";

/**
 * The Ellipse variant of a Scale Bar, supporting child markers
 *
 * This accepts (and passes on) all Props that `core/StyledScaleBar` does
 */
export default class RangeBar extends React.Component {
  static propTypes = {
    /**
     * The numeric value of the left hand end of the range bar
     * (the minimum possible value of the range)
     */
    minValue: PropTypes.number.isRequired,

    /**
     * The numeric value of the right hand end of the range bar
     * (the maximum possible value of the range)
     */
    maxValue: PropTypes.number.isRequired
  };

  get bounds() {
    const bounds = document
      .querySelector(`.${ClassName}`)
      .getBoundingClientRect();
    // Handle MS ClientRect since even Edge is non-standard >.<
    if (bounds.x == null) bounds.x = bounds.left;
    if (bounds.y == null) bounds.y = bounds.top;

    return bounds;
  }

  /**
   * Convert an absolute x co-ordinate to a value on this RangeBar
   * @public
   * @param {number} x the absolute x co-ordinate
   * @returns {number} The converted value
   */
  getValueForX(x) {
    const { width } = this.bounds;
    const relativeX = this.getRelativeXPos(x);
    return (
      (this.props.maxValue - this.props.minValue) * (relativeX / width) +
      this.props.minValue
    );
  }

  /**
   * Convert a value on the bar back to a relative x co-ordinate
   * @public
   * @param {number} value the value to convert
   * @returns {number} The relative x co-ordinate
   */
  getXPosForValue(value) {
    // get value as a ratio of absolute bar range
    const adjustedValue = value - this.props.minValue;
    const absBarMax = this.props.maxValue - this.props.minValue;
    const valueRatio = adjustedValue / absBarMax;

    // apply the ratio to the relative max co-ord
    return this.bounds.width * valueRatio;
  }

  /**
   * Convert an absolute (whole page) x value
   * to a bar relative one, clamping to the
   * ends of the bar
   * @public
   * @param {number} x the absolute x co-ordinate
   * @returns {number} The relative x co-ordinate
   */
  getRelativeXPos(x) {
    const { bounds } = this;
    return x <= bounds.x // clamp results to the bar bounds, else adjust the offset
      ? 0
      : x >= bounds.right
      ? bounds.width
      : x - bounds.x;
  }

  render() {
    return <ScaleBar {...this.props} />;
  }
}
