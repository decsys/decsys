// MVAS Behaviours to make it work like Hesketh, Pryor & Hesketh 1988

export const initialMarkerBounds = ({ width, x }) => ({
  left: { xMin: x },
  right: { xMax: width + x },
  center: { xInit: width / 2, xMin: x, xMax: width + x },
});

export const updateMarkerBounds = (
  markerBounds,
  markerX,
  markerPositioning
) => {
  const { xOffset } = markerPositioning;

  // in case we need to reset any
  const initialBounds = initialMarkerBounds(
    markerBounds.right.xMax - markerBounds.left.xMin, // always bar width
    markerBounds.left.xMin // always bar x
  );

  // center updates
  // center bounds are based on the others
  markerBounds.center.xMin =
    markerX.left != null ? markerX.left + xOffset : initialBounds.center.xMin;
  markerBounds.center.xMax =
    markerX.right != null ? markerX.right + xOffset : initialBounds.center.xMax;

  // left updates
  if (markerX.center != null) {
    // left is after center, so init it
    // center / 2
    markerBounds.left.xInit = markerX.center / 2;

    // left max is based on center
    markerBounds.left.xMax = markerX.center + xOffset;
  } else {
    markerBounds.left = initialBounds.left;
  }

  // right updates
  if (markerX.left != null) {
    // right is after left, so init it
    // left + (rightMax - left) / 2 - (offset / 2)
    markerBounds.right.xInit =
      markerX.center +
      (markerBounds.right.xMax - markerX.center) / 2 -
      xOffset / 2;

    // right min is based on center
    markerBounds.right.xMin = markerX.center + xOffset;
  } else {
    markerBounds.right = initialBounds.right;
  }

  return markerBounds;
};
