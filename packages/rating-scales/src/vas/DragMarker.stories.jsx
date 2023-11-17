import { DragMarker } from "./DragMarker";
import { useState } from "react";

export default {
  title: "VAS+MVAS/DragMarker",
  component: DragMarker,
  argTypes: {
    baseY: { control: "number" },
    x: { control: "number" },
    xMin: { control: "number" },
    xMax: { control: "number" },
    label: { control: "text" },
    onDrop: { action: "markerPositionChanged" },
  },
  args: {
    baseY: 100,
    x: 100,
    label: "",
  },
};

const BoundMarker = ({ xPos }) => (
  <div
    style={{
      position: "absolute",
      minHeight: "50vh",
      color: "red",
      left: xPos,
      borderLeft: "thin solid red",
    }}
  ></div>
);

export const Basic = (args) => {
  const [markerPos, setMarkerPos] = useState(args.x);

  const handleChange = (x) => {
    setMarkerPos(x);
    args.onDrop(x);
  };

  return (
    <>
      <DragMarker {...args} onDrop={handleChange} />
      <input
        style={{ border: "thin solid grey" }}
        value={markerPos}
        onChange={(e) => setMarkerPos(parseInt(e.target.value))}
      />
    </>
  );
};

export const WithBounds = (args) => (
  <>
    <BoundMarker xPos={`${args.xMin}px`} />
    <BoundMarker xPos={`${args.xMax}px`} />
    <Basic {...args} />
  </>
);
WithBounds.args = {
  ...Basic.args,
  xMin: 200,
  xMax: 400,
  x: 300,
};

export const Labelled = Basic.bind({});
Labelled.args = {
  ...Basic.args,
  label: "L",
};
