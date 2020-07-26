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
