// MVAS Behaviours to make it work like Speirs-Bridge 2010
import { getUpdatedBaseZ } from "./shared";

export const getInitialState = ({ width, x }) => ({
  // Speirs-Bridge 2010 goes left -> right -> center, so init left only
  left: {
    x: width / 2,
    xMin: x,
    xMax: width + x,
  },
  right: { xMax: width + x },
});

export const getUpdatedState = (markerState, barBounds) => {
  // Update zIndex first
  markerState = getUpdatedBaseZ(markerState, barBounds);

  let {
    shared: { baseX },
    left,
    right,
    center,
  } = markerState;

  // in case we need to reset any
  const initialState = getInitialState(barBounds);

  // left updates
  if ((center.x ?? right.x) != null) left.xMax = (center.x ?? right.x) + baseX;
  else left.xMax = initialState.left.xMax;

  // right updates
  if (left.isActivated) {
    // right is after left, so init it
    // left + (rightMax - left) / 2 - (offset / 2)
    if (!right.isActivated)
      right.x = left.x + (right.xMax - left.x) / 2 - baseX / 2;

    // right min is based on left
    right.xMin = left.xMin;
  } else {
    right = initialState.right;
  }

  if ((center.x ?? left.x) != null) right.xMin = (center.x ?? left.x) + baseX;

  // center updates
  if (right.isActivated) {
    // center is after right, so init it
    // left + (right - left) / 2
    if (!center.isActivated) center.x = left.x + (right.x - left.x) / 2;
    // center bounds are based on the others
    center.xMin = left.x + baseX;
    center.xMax = right.x + baseX;
  } else {
    center = initialState.center ?? {};
  }

  console.log(left, right, center);

  return { ...markerState, left, right, center };
};
