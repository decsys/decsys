// MVAS Behaviours to make it work like Hesketh, Pryor & Hesketh 1988

import { getUpdatedBaseZ } from "./shared";

export const getInitialState = ({ width, x }) => {
  const result = {
    left: { xMin: x },
    right: { xMax: width + x },
    center: { x: width / 2, xMin: x, xMax: width + x },
  };
  console.log(result);
  return result;
};

export const getUpdatedState = (markerState, barWidth) => {
  // Update zIndex first
  markerState = getUpdatedBaseZ(markerState, barWidth);

  let {
    shared: { baseX },
    left,
    right,
    center,
  } = markerState;

  // in case we need to reset any
  const initialBounds = getInitialState({
    width: right.xMax - left.xMin, // always bar width
    x: left.xMin, // always bar x
  });

  // center updates
  // center bounds are based on the others
  center.xMin = left.x != null ? left.x + baseX : initialBounds.center.xMin;
  center.xMax = right.x != null ? right.x + baseX : initialBounds.center.xMax;

  // left updates
  if (center.isActivated) {
    // left is after center, so init it
    // center / 2
    if (!left.isActivated) left.x = center.x / 2;

    // left max is based on center
    left.xMax = center.x + baseX;
  } else {
    left = initialBounds.left;
  }

  // right updates
  if (left.isActivated) {
    // right is after left, so init it
    // left + (rightMax - left) / 2 - (offset / 2)
    if (!right.isActivated)
      right.x = center.x + (right.xMax - center.x) / 2 - baseX / 2;

    // right min is based on center
    right.xMin = center.x + baseX;
  } else {
    right = initialBounds.right;
  }

  return { ...markerState, left, right, center };
};
