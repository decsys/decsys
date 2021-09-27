// MVAS Behaviours to make it work like Speirs-Bridge 2010

export const initialMarkerBounds = ({ width, x }) => ({
  // Speirs-Bridge 2010 goes left -> right -> center, so init left only
  left: { xInit: width / 2, xMin: x, xMax: width + x },
  right: { xMax: width + x },
});

export const updateMarkerBounds = (
  markerBounds,
  markerX,
  markerPositioning
) => {
  const { xOffset } = markerPositioning;

  // in case we need to reset any
  const initialBounds = initialMarkerBounds({
    width: markerBounds.right.xMax - markerBounds.left.xMin, // always bar width
    x: markerBounds.left.xMin, // always bar x
  });

  // left updates
  if ((markerX.center ?? markerX.right) != null)
    markerBounds.left.xMax = (markerX.center ?? markerX.right) + xOffset;
  else markerBounds.left.xMax = initialBounds.left.xMax;

  // right updates
  if (markerX.left != null) {
    // right is after left, so init it
    // left + (rightMax - left) / 2 - (offset / 2)
    markerBounds.right.xInit =
      markerX.left + (markerBounds.right.xMax - markerX.left) / 2 - xOffset / 2;

    // right min is based on left
    markerBounds.right.xMin = markerBounds.left.xMin;
  } else {
    markerBounds.right = initialBounds.right;
  }

  if ((markerX.center ?? markerX.left) != null)
    markerBounds.right.xMin = (markerX.center ?? markerX.left) + xOffset;

  // center updates
  if (markerX.right != null) {
    // center is after right, so init it
    // left + (right - left) / 2
    markerBounds.center.xInit =
      markerX.left + (markerX.right - markerX.left) / 2;
    // center bounds are based on the others
    markerBounds.center.xMin = markerX.left + xOffset;
    markerBounds.center.xMax = markerX.right + xOffset;
  } else {
    markerBounds.center = initialBounds.center ?? {};
  }

  return markerBounds;
};
