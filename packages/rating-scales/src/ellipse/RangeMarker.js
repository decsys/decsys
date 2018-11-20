import styled from "styled-components";
import PropTypes from "prop-types";
import ScaleMarker from "./ScaleMarker";

/**
 * A marker for the RangeBar to indicate
 * the range of an ellipse drawn against the bar
 */
const RangeMarker = styled(ScaleMarker)`
  &::before {
    z-index: 3;
  }
`;

RangeMarker.propTypes = {
  /** A valid CSS Color value for the marker */
  markerColor: PropTypes.string,

  /** A valid CSS Dimension value for the length of the marker */
  length: PropTypes.string,

  /** A valid CSS Dimension value for the thickness of the marker */
  thickness: PropTypes.string
};

RangeMarker.defaultProps = {
  markerColor: "black"
};

/** @component */
export default RangeMarker;
