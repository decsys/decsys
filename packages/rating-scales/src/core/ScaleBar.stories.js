import React, { useCallback, useState } from "react";
import ScaleBar, { scaleBarDefaultProps } from "./ScaleBar";
import { text } from "@storybook/addon-knobs";

export default {
  title: "core/ScaleBar",
  component: ScaleBar,
  decorators: [
    (s) => (
      <div
        style={{
          width: "100%",
        }}
      >
        {s()}
      </div>
    ),
  ],
};

export const Basic = () => <ScaleBar />;

export const WithKnobs = () => (
  <ScaleBar
    barColor={text("Bar Color", scaleBarDefaultProps.barColor)}
    topMargin={text("Top Margin", scaleBarDefaultProps.topMargin)}
    leftMargin={text("Left Margin", scaleBarDefaultProps.leftMargin)}
    rightMargin={text("Right Margin", scaleBarDefaultProps.rightMargin)}
    thickness={text("Bar Thickness", scaleBarDefaultProps.thickness)}
  />
);

export const WithChildren = () => (
  <ScaleBar>
    {[1, 2, 3].map((n) => (
      <div style={{ marginTop: `${n}0px` }} key={n}>
        {n}
      </div>
    ))}
  </ScaleBar>
);

export const WithRef = () => {
  const [width, setWidth] = useState();
  const barRef = useCallback((bar) => {
    const resize = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.target.getBoundingClientRect().width);
      }
    });

    resize.observe(bar);
  }, []);

  return (
    <>
      <div>Bar width: {width} (Try resizing the window)</div>
      <ScaleBar ref={barRef} topMargin="80px" />
    </>
  );
};
