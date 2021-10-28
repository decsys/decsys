import {
  useCallback,
  useState,
  forwardRef,
  createContext,
  useContext,
} from "react";

const zIndexOffsets = {
  Pin: 100,
  Label: 101,
};

const DragMarkerContext = createContext({
  baseY: 0,
  inactiveY: 20,
  isActivated: false,
  color: "#000",
  interactColor: "#69b",
  baseZ: 0,
  label: "",
  labelColor: "#fff",
  isDragging: false,
});

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

const MarkerPin = () => {
  const { color, interactColor, baseZ, isActivated, isDragging } =
    useContext(DragMarkerContext);

  const dropShadow = (dist) =>
    `drop-shadow(${dist}px ${dist}px ${dist}px rgba(.3,.3,.3,.8))`;

  const inUseStyles = {
    color: interactColor || "inherit",
    cursor: "grab",
  };

  const styles = {
    touchAction: "none",
    zIndex: baseZ + zIndexOffsets.Pin,
    width: "32px",
    top: "-43px",
    left: "-16px",
    position: "absolute",
    opacity: isActivated ? 1 : 0.5,
    color,
    "&:hover": inUseStyles,
    transition: "color .1s, top .1s, filter .1s",
  };

  return (
    <div
      css={
        isDragging
          ? { ...styles, ...inUseStyles, filter: dropShadow(3), top: "-48px" }
          : styles
      }
    >
      <MarkerIcon />
    </div>
  );
};

const MarkerLabel = () => {
  const { label, labelColor, baseZ } = useContext(DragMarkerContext);

  const styles = {
    position: "absolute",
    userSelect: "none",
    color: labelColor,
    top: "-43px",
    left: "-16px",
    width: "32px",
    textAlign: "center",
    zIndex: baseZ + 101,
    fontWeight: "bold",
    pointerEvents: "none",
  };

  return label ? <div css={styles}>{label}</div> : null;
};

const Marker = forwardRef(({ x }, ref) => {
  const { baseY, inactiveY, isActivated } = useContext(DragMarkerContext);

  const styles = {
    position: "absolute",
    top: `${isActivated ? baseY : baseY - inactiveY}px`,
    width: 0,
    height: 0,
    left: `${x}px`,
  };

  return (
    <div css={styles} ref={ref}>
      <MarkerLabel />
      <MarkerPin />
    </div>
  );
});

const DragMarker = ({
  baseX = 0,
  baseY = 0,
  baseZ = 0,
  inactiveY = 20,
  xMin,
  xMax,
  isActivated,
  color = "#000",
  interactColor = "#69b",
  label,
  labelColor = "#fff",
  onDrop = () => {},
  x,
}) => {
  const isControlled = x == null;
  const { markerRef, isDragging } = useDragMarker({
    baseX,
    xMin,
    xMax,
    isControlled,
    onDrop,
  });

  if (x == null) return null;

  return (
    <DragMarkerContext.Provider
      value={{
        baseY,
        baseZ,
        inactiveY,
        isActivated,
        color,
        interactColor,
        label,
        labelColor,
        isDragging,
      }}
    >
      <Marker ref={markerRef} x={x} />
    </DragMarkerContext.Provider>
  );
};

const useDragMarker = ({ baseX, xMin, xMax, onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  const markerRef = useCallback(
    (marker) => {
      if (!marker) return;

      let xPos;

      const handleMove = (e) => {
        // clamp x if necessary
        const clampedX = Math.min(
          Math.max(e.pageX, xMin ?? 0),
          xMax ?? e.pageX
        );
        //offset it for the CSS positioning
        xPos = clampedX - baseX;
        marker.style.left = `${xPos}px`;
      };

      marker.onpointerdown = (e) => {
        setIsDragging(true);
        marker.setPointerCapture(e.pointerId);
        marker.onpointermove = handleMove;
        marker.style.cursor = "grabbing";

        handleMove(e); // act as if we've moved the pointer to this position
      };

      marker.onpointerup = (e) => {
        setIsDragging(false);
        marker.onpointermove = null;
        marker.releasePointerCapture(e.pointerId);
        marker.style.cursor = null;
        marker.style.left = null;
        onDrop(xPos);
      };
    },
    [baseX, xMax, xMin, onDrop]
  );

  // TODO might wrap up the actions for use in onDrop? e.g. setValue/Position?
  // or might not need them outside the hook for use in onDrop?
  return { isDragging, markerRef };
};

export { DragMarker };
