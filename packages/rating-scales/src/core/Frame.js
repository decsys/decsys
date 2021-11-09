import PropTypes from "prop-types";

/**
 * A containing frame for a scale component.
 *
 * This component sets a base CSS font-size which many relative values
 * (`em`, `rem`, `%`) in sub-components are based on
 */
const Frame = ({ frameHeight, ...p }) => (
  <div
    css={{
      minHeight: frameHeight,
      height: frameHeight,
      width: "100%",
      position: "relative",
      fontSize: "14px",
      userSelect: "none",
    }}
    {...p}
  />
);

export const framePropTypes = {
  /** A valid CSS Dimension value for the height of the Frame. */
  frameHeight: PropTypes.string,
};

Frame.propTypes = framePropTypes;
Frame.defaultProps = {
  frameHeight: "400px",
};

/** @component */
export default Frame;
