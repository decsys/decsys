import React, { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * Simply provides a container for children of a ScaleBar
 * that will be evenly spaced out using flexbox
 */
export const FlexContainer = (p) => (
  <div
    css={{
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    }}
    {...p}
  />
);

const ScaleBar = (
  { leftMargin, rightMargin, topMargin, thickness, barColor, ...p },
  ref
) => {
  return (
    <div
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
      ref={ref}
      {...p}
    />
  );
};

/**
 * A reusable scale bar, that can be styled and contain further
 * scale components such as radio buttons, markers, labels etc.
 */
const ForwardScaleBar = forwardRef(ScaleBar);

export const scaleBarPropTypes = {
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

export const scaleBarDefaultProps = {
  leftMargin: "10%",
  rightMargin: "10%",
  topMargin: "50%",
  thickness: "0.2em",
  barColor: "black",
};

ScaleBar.propTypes = { ...scaleBarPropTypes };
ForwardScaleBar.propTypes = scaleBarPropTypes;
ForwardScaleBar.defaultProps = scaleBarDefaultProps;

/** @component */
export default ForwardScaleBar;
