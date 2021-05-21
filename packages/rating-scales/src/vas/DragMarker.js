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

const DragMarker = ({ yAnchor = 0 }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(); // we need this so the handlers in useCallback can use the correct value
  isDraggingRef.current = isDragging;

  const handlePointerDown = () => {
    setIsDragging(true);
    markerRef.current.style.top = `${yAnchor}px`;
    setIsActivated(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    markerRef.current.style.left = `${e.pageX}px`;
  };

  const markerRef = useRef();
  // we need this because we're adding event handlers baed on dom ref availability
  const markerRefCb = useCallback((marker) => {
    if (markerRef.current) {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      markerRef.current.removeEventListener("pointerdown", handlePointerDown);
    }
    if (!marker) return;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    marker.addEventListener("pointerdown", handlePointerDown);

    markerRef.current = marker;
  }, []);

  const inUseStyles = {
    filter: "drop-shadow(5px 5px 5px rgba(.5,.5,.5,.5))",
    top: "-34px",
    left: "-18px",
  };
  const mainStyles = {
    width: "32px",
    top: "-32px",
    left: "-16px",
    position: "absolute",
    color: isActivated ? "black" : "grey",
    "&:hover": inUseStyles,
  };

  const markerStyles = isDragging
    ? { ...mainStyles, ...inUseStyles, color: "blue" }
    : mainStyles;

  return (
    <div
      css={{
        position: "absolute",
        top: `${yAnchor - 5}px`,
        width: 0,
        height: 0,
      }}
      ref={markerRefCb}
    >
      <div css={markerStyles}>
        <MarkerIcon />
      </div>
    </div>
  );
};

export { DragMarker };
