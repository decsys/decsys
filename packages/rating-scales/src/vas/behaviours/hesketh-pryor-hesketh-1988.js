// MVAS Behaviours to make it work like Hesketh, Pryor & Hesketh 1988

export const initialMarkerBounds = ({ width, x }) => {
  const result = {
    left: { xMin: x },
    right: { xMax: width + x },
    center: { x: width / 2, xMin: x, xMax: width + x },
  };
  console.log(result);
  return result;
};

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

  // center updates
  // center bounds are based on the others
  markerBounds.center.xMin =
    markerX.left != null ? markerX.left + baseX : initialBounds.center.xMin;
  markerBounds.center.xMax =
    markerX.right != null ? markerX.right + baseX : initialBounds.center.xMax;

  // left updates
  if (markerX.center != null) {
    // left is after center, so init it
    // center / 2
    markerBounds.left.x = markerX.center / 2;

    // left max is based on center
    markerBounds.left.xMax = markerX.center + baseX;
  } else {
    markerBounds.left = initialBounds.left;
  }

  // right updates
  if (markerX.left != null) {
    // right is after left, so init it
    // left + (rightMax - left) / 2 - (offset / 2)
    markerBounds.right.x =
      markerX.center +
      (markerBounds.right.xMax - markerX.center) / 2 -
      baseX / 2;

    // right min is based on center
    markerBounds.right.xMin = markerX.center + baseX;
  } else {
    markerBounds.right = initialBounds.right;
  }

  return markerBounds;
};
