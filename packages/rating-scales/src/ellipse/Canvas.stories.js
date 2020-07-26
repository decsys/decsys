import React, { useState, useRef } from "react";
import EllipseCanvas from "./Canvas";
import StyledFrame from "../core/StyledFrame";
import { Button } from "@chakra-ui/core";
import { text, number } from "@storybook/addon-knobs";

export default {
  title: "Ellipse/Canvas",
  component: EllipseCanvas,
  decorators: [(s) => <StyledFrame>{s()}</StyledFrame>],
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
      <StyledFrame>
        <EllipseCanvas ref={canvasRef} />
      </StyledFrame>
    </>
  );
};

export const WithKnobs = () => (
  <StyledFrame>
    <EllipseCanvas
      color={text("Pen Color", "red")}
      thickness={number("Pen Thickness", 5)}
    />
  </StyledFrame>
);
