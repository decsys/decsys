import React, { useState, useRef, useCallback } from "react";
import EllipseCanvas from "./Canvas";
import Frame from "../core/Frame";
import { Button } from "@chakra-ui/core";
import { text, number } from "@storybook/addon-knobs";

export default {
  title: "Ellipse/Canvas",
  component: EllipseCanvas,
  decorators: [(s) => <Frame>{s()}</Frame>],
};

export const Basic = () => <EllipseCanvas />;

export const WithCallbacks = () => {
  const [data, setData] = useState();
  const handleDraw = (data) => {
    setData(data);
  };

  let status;
  if (data?.completed)
    status = <div style={{ color: "green" }}>ellipse complete!</div>;
  else if (data?.points?.length > 0)
    status = <div style={{ color: "orange" }}>drawing!</div>;
  else status = <div style={{ color: "red" }}>Draw something</div>;

  return (
    <>
      {status}
      <EllipseCanvas onDraw={handleDraw} />
    </>
  );
};

export const ImperativelyClear = () => {
  const canvasRef = useRef();
  return (
    <>
      <Button onClick={() => canvasRef.current.clear()}>
        Draw something, then click here to clear
      </Button>
      <Frame>
        <EllipseCanvas ref={canvasRef} />
      </Frame>
    </>
  );
};

export const WithRef = () => {
  const [width, setWidth] = useState();
  const canvasRef = useCallback((canvasRef) => {
    if (!canvasRef) return;
    const { canvas } = canvasRef;
    const resize = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.target.getBoundingClientRect().width);
      }
    });

    resize.observe(canvas);
  }, []);

  return (
    <>
      <div>Canvas width: {width} (Try resizing the window)</div>
      <Frame>
        <EllipseCanvas ref={canvasRef} />
      </Frame>
    </>
  );
};

export const WithKnobs = () => (
  <Frame>
    <EllipseCanvas
      color={text("Pen Color", "red")}
      thickness={number("Pen Thickness", 5)}
    />
  </Frame>
);
