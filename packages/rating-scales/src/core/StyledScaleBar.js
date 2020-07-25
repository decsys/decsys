import React from "react";
import PropTypes from "prop-types";

/**
 * The class name used on the ScaleBar's containing element.
 * May be of interest to anything that wants to select it.
 */
export const ClassName = "js--scalebar";

/**
 * A reusable scale bar, that can be styled and contain further
 * scale components such as radio buttons, markers, labels etc.
 */
const StyledScaleBar = ({
  leftMargin,
  rightMargin,
  topMargin,
  thickness,
  barColor,
  ...p
}) => (
  <div
    className={ClassName}
    css={{
      marginLeft: leftMargin,
      marginRight: rightMargin,
      position: "relative",
      top: topMargin,
      "&::before": {
        borderTop: `${thickness} solid ${barColor}`,
        content: '""',
        position: "absolute",
        top: `calc(${thickness} / -2)`,
        width: "100%",
        zIndex: 1,
      },
    }}
    {...p}
  />
);

StyledScaleBar.propTypes = {
  /** A valid CSS Dimension value for the bar left margin. */
  leftMargin: PropTypes.string,

  /** A valid CSS Dimension value for the bar right margin. */
  rightMargin: PropTypes.string,

  /** A valid CSS Dimension value for the bar top margin. */
  topMargin: PropTypes.string,

  /** A valid CSS Color value for the bar color. */
  barColor: PropTypes.string,

  /** A valid CSS Dimension value for the bar thickness. */
  thickness: PropTypes.string,
};

StyledScaleBar.defaultProps = {
  leftMargin: "10%",
  rightMargin: "10%",
  topMargin: "50%",
  thickness: "0.2em",
  barColor: "black",
};

/** @component */
export default StyledScaleBar;
