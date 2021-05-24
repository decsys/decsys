import PropTypes from "prop-types";
import { useRef, useCallback, useState } from "react";

// https://github.com/FortAwesome/Font-Awesome/blob/0d1f27efb836eb2ab994ba37221849ed64a73e5c/svgs/solid/map-marker.svg
// FontAwesome Solid
// map-marker
const MarkerIcon = (p) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    fill="currentColor"
    {...p}
  >
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z" />
  </svg>
);

/**
 * Sets up state and event handling for the marker
 * @param {*} xMin
 * @param {*} xMax
 * @returns
 */
const useDragMarker = (xMin, xMax, yAnchor, xOffset = 0) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const ref = useRef();
  // we need this because we're adding event handlers based on dom ref availability
  const markerRef = useCallback(
    (marker) => {
      if (!marker) return;

      const handleMove = (e) => {
        const clampedX = Math.min(
          Math.max(e.pageX, xMin ?? 0),
          xMax ?? e.pageX
        );
        marker.style.left = `${clampedX - xOffset}px`;
      };

      marker.onpointerdown = (e) => {
        setIsDragging(true);
        marker.onpointermove = handleMove;
        marker.setPointerCapture(e.pointerId);
        marker.style.cursor = "grabbing";
      };

      marker.onpointerup = (e) => {
        setIsActivated(true);
        setIsDragging(false);
        marker.onpointermove = null;
        marker.releasePointerCapture(e.pointerId);
        marker.style.cursor = null;
        marker.style.top = `${yAnchor}px`;
      };

      ref.current = marker;
    },
    [xMax, xMin, yAnchor, xOffset]
  );

  return { isDragging, isActivated, markerRef };
};

const getMarkerStyles = ({
  isActivated,
  isDragging,
  inactiveColor,
  interactColor,
  color,
}) => {
  const dropShadow = (dist) =>
    `drop-shadow(${dist}px ${dist}px ${dist}px rgba(.3,.3,.3,.8))`;

  const inUseStyles = {
    color: interactColor,
    cursor: "grab",
  };
  const mainStyles = {
    zIndex: 100,
    width: "32px",
    top: "-43px",
    left: "-16px",
    position: "absolute",
    color: isActivated ? color : inactiveColor,
    "&:hover": { ...inUseStyles },
    transition: "color .1s, top .1s, filter .1s",
  };

  return isDragging
    ? { ...mainStyles, ...inUseStyles, filter: dropShadow(3), top: "-48px" }
    : mainStyles;
};

const DragMarker = ({
  xInit,
  yAnchor = 0,
  xMin,
  xMax,
  xOffset = 0,
  inactiveColor = "#bbb",
  interactColor = "#69b",
  color = "#000",
}) => {
  const { isActivated, isDragging, markerRef } = useDragMarker(
    xMin,
    xMax,
    yAnchor,
    xOffset
  );

  if (!xInit) return null; // don't render if we don't have positional information (e.g. the ScaleBar position isn't yet available)

  return (
    <div
      css={{
        position: "absolute",
        top: `${yAnchor - 5}px`,
        left: `${xInit}px`,
        width: 0,
        height: 0,
      }}
      ref={markerRef}
    >
      <div
        css={getMarkerStyles({
          isActivated,
          isDragging,
          inactiveColor,
          interactColor,
          color,
        })}
      >
        <MarkerIcon />
      </div>
    </div>
  );
};

export const dragMarkerPropTypes = {
  /**
   * absolute x position (px) the marker should start at, before any dragging has occurred
   * Note that no value for this will cause the marker not to render (even if a dragged position has been set),
   * allowing for preparing/rendering any relative parent on which x position may depend.
   **/
  xInit: PropTypes.number,

  /** absolute y position (px) the marker is anchored at */
  yAnchor: PropTypes.number,

  /** optional minimum x position (px) the marker can reach. sensitive to parent margins / xOffset */
  xMin: PropTypes.number,

  /** optional maximum x position (px) the marker can reach. sensitive to parent margins / xOffset */
  xMax: PropTypes.number,

  /**
   * due to CSS absolute position taking into account parent margins,
   * an xOffset (px) may be desirable to negate this effect
   * (and provide more accurate mouse position tracking).
   * Typically the value of xOffset will be the relative parent's left margin.
   * The offset is used to calculate position on mouse move,
   * and to calculate the correct min/max position bounds in xMin/xMax.
   **/
  xOffset: PropTypes.number,

  /** Color of the marker when incative (i.e. before ANY dragging has occurred, if no default value) */
  inactiveColor: PropTypes.string,

  /** Color of the marker to show interaction (hover/dragging) */
  interactColor: PropTypes.string,

  /** Color of the marker at rest, when no other more specific color applies */
  color: PropTypes.string,
};

DragMarker.propTypes = dragMarkerPropTypes;

DragMarker.defaultProps = {
  yAnchor: 0,
  xOffset: 0,
  inactiveColor: "#bbb",
  interactColor: "#69b",
  color: "#000",
};

export { DragMarker };
