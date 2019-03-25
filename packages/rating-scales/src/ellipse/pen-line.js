import { Graphics } from "pixi.js/lib/pixi.es";
import nameToHexString from "colornames";

// Namespaced helpers used internally in this module

/** Utility functions for working with colors */
const Color = {
  /**
   * Get a numeric value representing the RGB value of a supported color
   *
   * @param {string|number} input
   * The color, either by CSS friendly name (e.g. `red`)
   * or RGB Hex code (e.g. `#ff0000`)
   *
   * If a number, simply returns it rather than errorring
   * @returns {number} The color as a number value
   * which hexadecimally would look like `0xRRGGBB`
   */
  getNumber: input => {
    if (typeof input === "number") return input;

    if (typeof input !== "string")
      throw new TypeError(
        "String expected, either a CSS color name or RGB Hex code."
      );

    if (!input.startsWith("#")) {
      input = Color.getHexString(input);
    }

    if (!input) return;

    const result = parseInt(input.substring(1), 16);
    return !Number.isNaN(result) ? result : undefined;
  },

  /**
   * Get an RGB Hex code for a supported color name
   *
   * @param {string} input
   * The color, by CSS friendly name (e.g. `red`)
   *
   * @returns {string} The color as an RGB Hex code (e.g. `#ff0000`)
   */
  getHexString: input => {
    if (typeof input !== "string")
      throw new TypeError("CSS color name expected");
    return nameToHexString(input);
  }
};

/** Utility functions for calculating line collisions */
const Collision = {
  /** Determine the mid point between 2 points */
  midPoint: (p1, p2) => {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2
    };
  },

  /** Solve the normal quadratic form with values of a, b and c */
  quadratic: (a, b, c) => [
    (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
    (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)
  ],

  /** substitute a known `t` value into a parametric equation */
  substituteT: (v1, v2, v3, t) =>
    (v1 - 2 * v2 + v3) * t * t + 2 * (v2 - v1) * t + v1
};

/**
 * A PIXI Graphics object for drawing an ellipse,
 * joining a series of points with bezier curves
 */
export default class PenLine extends Graphics {
  constructor(parent, { color = "black", thickness = 2 } = {}) {
    super();

    parent.addChild(this);

    this.points = [];

    this.debugColliderY = 0;

    this.setOptions({ color, thickness });
  }

  get drawDebugCollider() {
    return window.DECSYS_JS_DEBUG;
  }

  setOptions({ thickness, color } = {}) {
    if (thickness != null) this.thickness = thickness;

    if (color != null) this.color = color;

    this._updateGraphics();
  }

  addPoint(point) {
    this.points.push(point);
    this._updateGraphics();
  }

  reset(point) {
    this.points.length = 0;
    this.points.push(point);
    this.clear();
  }

  _updateGraphics() {
    if (this.points.length < 2) return;

    const [{ x, y }] = this.points;

    this.clear()
      .lineStyle(this.thickness, Color.getNumber(this.color))
      .moveTo(x, y);

    for (let i = 1; i < this.points.length; i++) {
      const { x: ox, y: oy } = this.points[i - 1];
      const { x, y } = this.points[i];
      const { x: cx, y: cy } = Collision.midPoint({ x: ox, y: oy }, { x, y });
      this.quadraticCurveTo(ox, oy, cx, cy);
    }

    // optionally draw a 1px red line on the canvas
    // where we last performed collision detection
    if (this.drawDebugCollider && this.debugColliderY > 0) {
      this.lineStyle(1, 0xff0000)
        .moveTo(this.parent.hitArea.x, this.debugColliderY)
        .lineTo(this.parent.hitArea.width, this.debugColliderY);
    }
  }

  closePath() {
    if (this.points.length > 0) {
      this.addPoint(this.points[0]);
      // add twice due to our interpolation algorithm for curve drawing :\
      this.addPoint(this.points[0]);
    }
  }

  findIntersections(y) {
    this.debugColliderY = y; // store last attempted y in case we are outputting debug info
    if (this.drawDebugCollider)
      // if we ARE outputting debug info, also log the numeric value
      console.log(`pen collision detection at y value of ${y}`);

    const hits = []; // this will store x co-ords where we cross y
    let [end] = this.points; // this will become the first start point ;)
    for (let i = 0; i < this.points.length - 1; i++) {
      // the first thing we do is set / calculate the poitns we care about
      // we do this at the start of the loop so it never gets missed if we `continue` out
      const start = end; // set start to the previous end
      const cp1 = this.points[i]; // first control point is the current actual stored point
      const cp2 = this.points[i + 1]; // future control point allows us to calculate end point
      end = Collision.midPoint(cp1, cp2); // end point is the midpoint between the stored control points

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
          [t1, t2] = Collision.quadratic(a, b, c);
        } else {
          // linear
          t1 = -c / b;
        }

        // 3. We can now use the known values of t and substitute them into the parametric x equation:
        // we only care about `t` values in the range [0,1]
        if (t1 >= 0 && t1 <= 1)
          hits.push(Collision.substituteT(start.x, cp1.x, end.x, t1));
        if (t2 >= 0 && t2 <= 1)
          hits.push(Collision.substituteT(start.x, cp1.x, end.x, t2));
      }
    }
    return hits;
  }
}
