import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * A marker for the RangeBar to indicate
 * the range of an ellipse drawn against the bar
 */
const RangeMarker = styled.div`
  position: absolute;
  &::before {
    border-left: ${props =>
      `${props.markerThickness} solid ${props.markerColor}`};
    position: absolute;
    min-height: ${props => props.markerLength};
    top: ${props => `calc(${props.markerLength} / -2)`};
    left: ${props => `calc(${props.markerThickness} / -2)`};
    z-index: 2;
    content: "";
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
