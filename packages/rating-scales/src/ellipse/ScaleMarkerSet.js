import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ScaleMarker from "./ScaleMarker";

const ScaleMarkerContainer = styled.div`
  position: relative;
`;

/** A set of equally spaced ScaleMarkers, essentially forming a scale along the RangeBar */
export default class ScaleMarkerSet extends React.Component {
  static propTypes = {
    /** A valid CSS Color value for major markers */
    markerColor: PropTypes.string,
    /** A valid CSS Dimension value for the length of major markers */
    length: PropTypes.string,
    /** A valid CSS Dimension value for the thickness of major markers */
    thickness: PropTypes.string,
    /** A valid CSS Color value for subdivision markers */
    subColor: PropTypes.string,
    /** A valid CSS Dimension value for the length of subdivision markers */
    subLength: PropTypes.string,
    /** A valid CSS Dimension value for the thickness of subdividision markers */
    subThickness: PropTypes.string,
    /** The number of major markers to display along the scale bar */
    markers: PropTypes.number,
    /** The number of marker subdivisions */
    subdivisions: PropTypes.number
  };

  static defaultProps = {
    subdivisions: 1
  };

  render() {
    const markers = [];
    const nMarkers = this.props.subdivisions * (this.props.markers - 1) + 1;
    const subProps = {
      markerColor:
        this.props.subColor != null
          ? this.props.subColor
          : this.props.markerColor,
      length:
        this.props.subLength != null ? this.props.subLength : this.props.length,
      thickness:
        this.props.subThickness != null
          ? this.props.subThickness
          : this.props.thickness
    };
    for (let i = 0; i < nMarkers; i++) {
      const major = i === 0 || i % this.props.subdivisions === 0;
      markers.push(
        <ScaleMarkerContainer key={`scaleMarker${i}`}>
          <ScaleMarker {...(major ? this.props : subProps)} />
        </ScaleMarkerContainer>
      );
    }

    return markers;
  }
}
