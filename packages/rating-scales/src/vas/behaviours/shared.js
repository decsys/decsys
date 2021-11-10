export const getUpdatedBaseZ = (markerState, { width: barWidth }) => {
  const { left, right, center } = markerState;

  // calculate relative z-index values // TODO: maybe behaviour in future?
  left.baseZ = 0;
  right.baseZ = 0;
  center.baseZ = 0;

  // we need to know
  // a) how many markers are within a sensible overlap range (for center priority)
  const nearPx = 20;
  if (center.x != null) {
    const isNear = (x1, x2) => Math.abs(x1 - x2) < nearPx;
    let count = +(left.x != null && isNear(left.x, center.x));
    count += +(right.x != null && isNear(right.x, center.x));

    // if there's 1 marker nearby, center goes on top, so it can be moved away even at axis extremes
    // otherwise center goes at bottom, as it either makes no difference, or L/R are more important
    center.baseZ = count === 1 ? 50 : 0;
  }
  // b) if left marker is in the left or right half of the scale (for L/R priority)
  // we do this irrespective of closeness of markers
  // since it makes no difference at distance,
  // but is correct if any are close
  if (left.x < barWidth / 2) {
    left.baseZ = 10;
    right.baseZ = 20;
  } else {
    left.baseZ = 20;
    right.baseZ = 10;
  }

  return { ...markerState, left, right, center };
};
