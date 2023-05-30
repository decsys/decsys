import PropTypes from "prop-types";

//#region ScaleMarker and RangeMarker

/**
 * A marker for the RangeBar to indicate a point along the scale
 */
const ScaleMarker = ({ thickness, markerColor, length, ...p }) => (
  <div
    css={{
      position: "absolute",
      "&::before": {
        borderLeft: `${thickness} solid ${markerColor}`,
        position: "absolute",
        minHeight: length,
        top: `calc(${length} / -2)`,
        left: `calc(${thickness} / -2)`,
        zIndex: 2,
        content: '""',
      },
    }}
    {...p}
  />
);
export const scaleMarkerPropTypes = {
  /** A valid CSS Color value for the marker */
  markerColor: PropTypes.string,

  /** A valid CSS Dimension value for the length of the marker */
  length: PropTypes.string,

  /** A valid CSS Dimension value for the thickness of the marker */
  thickness: PropTypes.string,
};

ScaleMarker.propTypes = scaleMarkerPropTypes;
ScaleMarker.defaultProps = {
  markerColor: "black",
};

/**
 * A marker for the RangeBar to indicate
 * the range of an ellipse drawn against the bar
 */
export const RangeMarker = ({ position, ...p }) => (
  <ScaleMarker
    css={{
      display: position != null ? "block" : "none",
      left: `${position ?? 0}px`,
      "&::before": { zIndex: 3 },
    }}
    {...p}
  />
);
RangeMarker.propTypes = { ...scaleMarkerPropTypes, position: PropTypes.number };
RangeMarker.defaultProps = {
  markerColor: "black",
};

//#endregion

const ScaleMarkerContainer = (p) => (
  <div css={{ position: "relative" }} {...p} />
);

/** A set of equally spaced ScaleMarkers, essentially forming a scale along the RangeBar */
const ScaleMarkerSet = ({
  subdivisions,
  markers: major,
  subColor,
  markerColor,
  length,
  subLength,
  subThickness,
  thickness,
}) => {
  const markers = [];
  const nMarkers = subdivisions * (major - 1) + 1;
  const subProps = {
    markerColor: subColor ?? markerColor,
    length: subLength ?? length,
    thickness: subThickness ?? thickness,
  };
  for (let i = 0; i < nMarkers; i++) {
    const isMajor = i === 0 || i % subdivisions === 0;
    markers.push(
      <ScaleMarkerContainer key={i}>
        <ScaleMarker
          {...(isMajor ? { markerColor, length, thickness } : subProps)}
        />
      </ScaleMarkerContainer>
    );
  }

  return markers;
};

export const scaleMarkerSetPropTypes = {
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
  subdivisions: PropTypes.number,
};

ScaleMarkerSet.propTypes = scaleMarkerSetPropTypes;
ScaleMarkerSet.defaultProps = { subdivisions: 1 };

export { ScaleMarkerSet };
