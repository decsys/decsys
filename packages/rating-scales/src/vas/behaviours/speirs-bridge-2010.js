// MVAS Behaviours to make it work like Speirs-Bridge 2010

export const initialMarkerBounds = ({ width, x }) => ({
  // Speirs-Bridge 2010 goes left -> right -> center, so init left only
  left: { x: width / 2, xMin: x, xMax: width + x },
  right: { xMax: width + x },
});

export const updateMarkerBounds = (
  markerBounds,
  markerX,
  markerPositioning
) => {
  const { baseX } = markerPositioning;

  // in case we need to reset any
  const initialBounds = initialMarkerBounds({
    width: markerBounds.right.xMax - markerBounds.left.xMin, // always bar width
    x: markerBounds.left.xMin, // always bar x
  });

  // left updates
  if ((markerX.center ?? markerX.right) != null)
    markerBounds.left.xMax = (markerX.center ?? markerX.right) + baseX;
  else markerBounds.left.xMax = initialBounds.left.xMax;

  // right updates
  if (markerX.left != null) {
    // right is after left, so init it
    // left + (rightMax - left) / 2 - (offset / 2)
    markerBounds.right.x =
      markerX.left + (markerBounds.right.xMax - markerX.left) / 2 - baseX / 2;

    // right min is based on left
    markerBounds.right.xMin = markerBounds.left.xMin;
  } else {
    markerBounds.right = initialBounds.right;
  }

  if ((markerX.center ?? markerX.left) != null)
    markerBounds.right.xMin = (markerX.center ?? markerX.left) + baseX;

  // center updates
  if (markerX.right != null) {
    // center is after right, so init it
    // left + (right - left) / 2
    markerBounds.center.x = markerX.left + (markerX.right - markerX.left) / 2;
    // center bounds are based on the others
    markerBounds.center.xMin = markerX.left + baseX;
    markerBounds.center.xMax = markerX.right + baseX;
  } else {
    markerBounds.center = initialBounds.center ?? {};
  }

  return markerBounds;
};
