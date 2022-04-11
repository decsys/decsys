import { useCallback, useState } from "react";
import { ScaleBar, FlexContainer, ScaleBarProps } from "./ScaleBar";

export default {
  title: "core/ScaleBar",
  component: ScaleBar,
  decorators: [
    (Story) => (
      <div
        style={{
          height: "300px",
          width: "100%",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const Basic = (args: ScaleBarProps) => <ScaleBar {...args} />;

export const WithChildren = (args: ScaleBarProps) => (
  <ScaleBar {...args}>
    <FlexContainer>
      {[1, 2, 3].map((n) => (
        <div style={{ marginTop: `${n}0px` }} key={n}>
          {n}
        </div>
      ))}
    </FlexContainer>
  </ScaleBar>
);

export const WithRef = (args) => {
  const [width, setWidth] = useState<undefined | number>();
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
      <ScaleBar {...args} ref={barRef} />
    </>
  );
};
WithRef.args = {
  topMargin: "80px",
};
