import { DragMarker } from "./DragMarker";
import { useState } from "react";

export default {
  title: "VAS+MVAS/DragMarker",
  component: DragMarker,
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

  args = {
    ...args,
    x: markerPos,
    onDrop: (x) => {
      setMarkerPos(x);
      console.log(x);
    },
  };
  console.log(args);

  return (
    <>
      <DragMarker {...args} />
      <input
        style={{ border: "thin solid grey" }}
        value={markerPos}
        onChange={(e) => setMarkerPos(parseInt(e.target.value))}
      />
    </>
  );
};
Basic.args = {
  baseY: 100,
  x: 100,
};

export const WithBounds = (args) => (
  <>
    <BoundMarker xPos="200px" />
    <BoundMarker xPos="400px" />
    <Basic {...args} />
  </>
);
WithBounds.args = {
  baseY: 100,
  xMin: 200,
  xMax: 400,
  x: 300,
};

export const Labelled = Basic.bind({});
Labelled.args = {
  ...Basic.args,
  label: "L",
};
