/** Utility functions for calculating line collisions */

/** Determine the mid point between 2 points */
export const midPoint = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

/** Solve the normal quadratic form with values of a, b and c */
export const quadratic = (a, b, c) => [
  (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
  (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a),
];

/** substitute a known `t` value into a parametric equation */
export const substituteT = (v1, v2, v3, t) =>
  (v1 - 2 * v2 + v3) * t * t + 2 * (v2 - v1) * t + v1;

/**
 * Find where a path made by connecting `points` in sequence
 * intersects with the horizontal line at `y`
 * @param {number} y the y co-ordinate of the horizontal line to test intersections with
 * @param {object[]} points array of points `{ x, y }` that form a joined path.
 */
export const findIntersections = (y, points) => {
  const hits = []; // this will store x co-ords where we cross y
  let [end] = points; // this will become the first start point ;)
  for (let i = 0; i < points.length - 1; i++) {
    // the first thing we do is set / calculate the poitns we care about
    // we do this at the start of the loop so it never gets missed if we `continue` out
    const start = end; // set start to the previous end
    const cp1 = points[i]; // first control point is the current actual stored point
    const cp2 = points[i + 1]; // future control point allows us to calculate end point
    end = midPoint(cp1, cp2); // end point is the midpoint between the stored control points

    // is our starting "mid point" an intersection?
    if (start.y === y) {
      hits.push(start.x);
      continue;
    }

    // is our current point an intersection?
    if (cp1.y === y) {
      hits.push(cp1.x);
      continue;
    }

    // if neither of our current known points are intersections,
    // we need to see if our start and end "mid point"s
    // straddle y, to see if it's worth doing a
    // proper hit check

    // check if the two "mid points"
    // (i.e. the start and end of the curve)
    // straddle y
    if ((start.y < y && end.y > y) || (end.y < y && start.y > y)) {
      // ok, there is definitely a point at y
      // we just have to find it

      // get an equation for our curve from our 3 control points
      // (start, cp1 and end)
      // to do this we need a known x or y value
      // fortunately we have a known y
      // we need to find `t` so we can use the same value of `t` to get our x value(s)

      // 1. It's even easier if we make our fixed y = 0
      // we can translate our curve points by the fixed y, to get them relative to 0
      const y1 = start.y - y;
      const y2 = cp1.y - y;
      const y3 = end.y - y;

      // Now we can try to find `t`
      // Our curve is represented by a parametric equation:
      // 2 separate quadratic equations that work in tandem;
      // 1 for x, and 1 for y, that change with respect to `t`

      // 2. Using our known `y` (0) we can solve the y quadratic to find `t`
      // y(t) = ((1 - t)^2 * y1) + (2t(1 - t)y2) + (t^2 * y3)
      // rearranged to the standard quadratic form as:
      // ax^2 + bx + c = 0
      // (y1 - 2y2 + y3)t^2 + 2(y2 - y1)t + y1 = 0
      const a = y1 - 2 * y2 + y3;
      const b = 2 * (y2 - y1);
      const c = y1;

      // We can now chuck these values into either
      // the quadratic formula, if a != 0
      // or solve a linear equation if a == 0
      let t1 = -1;
      let t2 = -1;
      if (a !== 0) {
        // quadratic formula
        [t1, t2] = quadratic(a, b, c);
      } else {
        // linear
        t1 = -c / b;
      }

      // 3. We can now use the known values of t and substitute them into the parametric x equation:
      // we only care about `t` values in the range [0,1]
      if (t1 >= 0 && t1 <= 1) hits.push(substituteT(start.x, cp1.x, end.x, t1));
      if (t2 >= 0 && t2 <= 1) hits.push(substituteT(start.x, cp1.x, end.x, t2));
    }
  }
  return hits;
};
