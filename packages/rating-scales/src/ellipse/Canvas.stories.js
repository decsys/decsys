import React, { useState } from "react";
import EllipseCanvas from "./Canvas";
import StyledFrame from "../core/StyledFrame";

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
  else status = <div style={{ color: "red" }}>no action yet</div>;

  return (
    <>
      {status}
      <EllipseCanvas onDraw={handleDraw} />
    </>
  );
};
