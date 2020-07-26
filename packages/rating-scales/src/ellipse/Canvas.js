import React, { useState, useCallback, useEffect } from "react";
import "./pixi";
import { Graphics } from "@pixi/graphics";
import { Application } from "@pixi/app";
import * as Color from "./services/color";
import * as Collision from "./services/collision";
import PropTypes from "prop-types";

const getHandlers = (setPenPoints, setDimensions, setCompleted) => ({
  handlePointerDown: ({
    data: {
      buttons,
      global: { x, y },
    },
  }) => {
    if (buttons === 1) {
      setPenPoints([{ x, y }]);
      setCompleted(false);
    }
  },

  handlePointerMove: ({
    currentTarget,
    data: {
      buttons,
      global: { x, y },
    },
  }) => {
    if (buttons === 1) {
      // also check we are in the hit area
      // (we don't care for moves outside it)
      if (currentTarget.hitArea.contains(x, y)) {
        setPenPoints((penPoints) => [...penPoints, { x, y }]);
      }
    }
  },

  handlePointerUp: () => {
    // effectively close the path, but with a nice bezier
    setPenPoints((penPoints) => [...penPoints, penPoints[0], penPoints[0]]);
    setCompleted(true);
  },

  handleResize: (app) => {
    const { width, height } = app.view.parentElement.getBoundingClientRect();
    setDimensions({ width, height });
    app.renderer.resize(width, height);
  },
});

const initialisePixi = (
  canvas,
  setPen,
  { handlePointerDown, handlePointerMove, handlePointerUp, handleResize }
) => {
  const app = new Application({
    width: 0,
    height: 0,
    view: canvas,
    resolution: window.devicePixelRatio,
    antialias: true,
    transparent: true,
  });

  // pen
  const pen = new Graphics();
  app.stage.addChild(pen);
  setPen(pen);

  // stage configuration
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;
  app.stage.pointerdown = handlePointerDown;
  app.stage.pointermove = handlePointerMove;
  app.stage.pointerup = handlePointerUp;

  // resize
  window.onresize = () => handleResize(app);
  handleResize(app);
};

const draw = (pen, thickness, color, points) => {
  if (pen && points.length >= 2) {
    const [{ x, y }] = points;

    pen
      .clear()
      .lineStyle({
        width: thickness,
        color: Color.getNumber(color),
        join: "round",
        cap: "round",
      })
      .moveTo(x, y);

    for (let i = 1; i < points.length; i++) {
      const { x: ox, y: oy } = points[i - 1];
      const { x, y } = points[i];
      const { x: cx, y: cy } = Collision.midPoint({ x: ox, y: oy }, { x, y });
      pen.quadraticCurveTo(ox, oy, cx, cy);
    }

    // optionally draw a 1px red line on the canvas
    // where we last performed collision detection
    // if (drawDebugCollider && debugColliderY > 0) {
    //   this.lineStyle(1, 0xff0000)
    //     .moveTo(app.stage.hitArea.x, debugColliderY)
    //     .lineTo(app.stage.hitArea.width, debugColliderY);
    // }
  }
};

/**
 * An HTML Canvas element with styling applied, to be used for ellipse drawing
 *
 * Contains the drawing logic for simple pen drawing,
 * but needs to be provided with state for pen's path, and a function to update it.
 */
const EllipseCanvas = ({ color, thickness, onComplete, onDraw }) => {
  const [pen, setPen] = useState(new Graphics());
  const [penPoints, setPenPoints] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  getHandlers(setPenPoints, setDimensions);

  // the canvas element triggers initialisation of PIXI
  const canvasRef = useCallback((canvas) => {
    if (!canvas) return;
    initialisePixi(
      canvas,
      setPen,
      getHandlers(setPenPoints, setDimensions, setCompleted)
    );
  }, []);

  //re-draw on state/props change
  useEffect(() => {
    draw(pen, thickness, color, penPoints);
  }, [pen, penPoints, thickness, color]);

  // trigger callback props
  useEffect(() => {
    const payload = { points: penPoints, completed };
    if (completed) onComplete(payload);
    onDraw(payload);
  }, [completed, penPoints]);

  return (
    <canvas
      ref={canvasRef}
      css={{
        position: "absolute",
        zIndex: 100,
        top: 0,
        left: 0,
        ...dimensions,
      }}
    />
  );
};

EllipseCanvas.propTypes = {
  /** A valid CSS Color value for the pen line */
  color: PropTypes.string,

  /** A numeric value for the pen line thickness */
  thickness: PropTypes.number,

  /** A callback, called when an Ellipse is completed */
  onComplete: PropTypes.func,

  /** A callback, called every draw action */
  onDraw: PropTypes.func,
};

EllipseCanvas.defaultProps = {
  color: "black",
  thickness: 2,
  onComplete: () => {},
  onDraw: () => {},
};

/** @component */
export default EllipseCanvas;
