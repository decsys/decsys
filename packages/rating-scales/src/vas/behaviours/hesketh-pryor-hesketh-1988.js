// MVAS Behaviours to make it work like Hesketh, Pryor & Hesketh 1988
import { getUpdatedBaseZ } from "./shared";

export const getInitialState = ({ width, x }) => {
  return {
    left: {
      xMin: x,
    },
    right: {
      xMax: width + x,
    },
    center: {
      x: width / 2,
      xMin: x,
      xMax: width + x,
    },
  };
};

export const getUpdatedState = (markerState, barOptions, barBounds) => {
  // Update zIndex first
  markerState = getUpdatedBaseZ(markerState, barOptions, barBounds);

  let {
    shared: { baseX },
    left,
    right,
    center,
  } = markerState;

  // in case we need to reset any
  const initialState = getInitialState(barBounds);

  // center updates
  // center bounds are based on the others
  center.xMin = left.x != null ? left.x + baseX : initialState.center.xMin;
  center.xMax = right.x != null ? right.x + baseX : initialState.center.xMax;

  // left updates
  if (center.isActivated) {
    // left is after center, so init it
    // center / 2
    if (!left.isActivated) left.x = center.x / 2;

    // left max is based on center
    left.xMax = center.x + baseX;
  } else {
    left = initialState.left;
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
    right = initialState.right;
  }

  return { ...markerState, left, right, center };
};
