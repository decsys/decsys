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
const useDragMarker = (xMin, xMax, yAnchor) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const ref = useRef();
  // we need this because we're adding event handlers based on dom ref availability
  const markerRef = useCallback((marker) => {
    if (!marker) return;

    const handleMove = (e) => {
      const clampedX = Math.min(Math.max(e.pageX, xMin ?? 0), xMax ?? e.pageX);
      marker.style.left = `${clampedX}px`;
    };

    marker.onpointerdown = (e) => {
      setIsActivated(true);
      setIsDragging(true);
      marker.onpointermove = handleMove;
      marker.setPointerCapture(e.pointerId);
      marker.style.cursor = "grabbing";
      marker.style.top = `${yAnchor}px`;
    };

    marker.onpointerup = (e) => {
      setIsDragging(false);
      marker.onpointermove = null;
      marker.releasePointerCapture(e.pointerId);
      marker.style.cursor = null;
    };

    ref.current = marker;
  }, []);

  return { isDragging, isActivated, markerRef };
};

const getMarkerStyles = ({ isActivated, isDragging }) => {
  const dropShadow = (dist) =>
    `drop-shadow(${dist}px ${dist}px ${dist}px rgba(.2,.2,.2,.8))`;

  const inUseStyles = {
    filter: dropShadow(3),
    top: "-36px",
    cursor: "grab",
  };
  const mainStyles = {
    width: "32px",
    top: "-32px",
    left: "-16px",
    position: "absolute",
    color: isActivated ? "black" : "grey",
    "&:hover": { ...inUseStyles },
    transition: "color .1s, top .1s, filter .1s",
  };

  return isDragging
    ? { ...mainStyles, ...inUseStyles, color: "blue" }
    : mainStyles;
};

const DragMarker = ({ xInit = 0, yAnchor = 0, xMin, xMax }) => {
  const { isActivated, isDragging, markerRef } = useDragMarker(
    xMin,
    xMax,
    yAnchor
  );

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
      <div css={getMarkerStyles({ isActivated, isDragging })}>
        <MarkerIcon />
      </div>
    </div>
  );
};

export { DragMarker };
