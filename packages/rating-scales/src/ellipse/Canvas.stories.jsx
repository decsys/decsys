import { EllipseCanvas } from "./Canvas";
import { Frame } from "../core/Frame";
import { Button } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";

export default {
  title: "Ellipse/Canvas",
  component: EllipseCanvas,
  tags: ["autodocs"],
  decorators: [(Story) => <Frame>{<Story />}</Frame>],
  argTypes: {
    color: { control: "text" },
    thickness: { control: "number" },
  },
};

export const Basic = (args) => <EllipseCanvas {...args} />;

export const WithControl = {
  args: {
    color: "red",
    thickness: 5,
  },
};

export const WithCallbacks = (args) => {
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
      <EllipseCanvas onDraw={handleDraw} {...args} />
    </>
  );
};

export const ImperativelyClear = (args) => {
  const canvasRef = useRef();
  return (
    <>
      <Button onClick={() => canvasRef.current.clear()}>
        Draw something, then click here to clear
      </Button>
      <Frame>
        <EllipseCanvas ref={canvasRef} {...args} />
      </Frame>
    </>
  );
};

export const WithRef = (args) => {
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
        <EllipseCanvas ref={canvasRef} {...args} />
      </Frame>
    </>
  );
};
