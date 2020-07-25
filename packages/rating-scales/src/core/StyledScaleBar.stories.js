import React from "react";
import StyledScaleBar from "./StyledScaleBar";
import { text } from "@storybook/addon-knobs";
import StyledBarContainer from "./StyledBarContainer";

export default {
  title: "core/StyledScaleBar",
  component: StyledScaleBar,
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

export const Basic = () => <StyledScaleBar />;

export const WithKnobs = () => (
  <StyledScaleBar
    barColor={text("Bar Color", StyledScaleBar.defaultProps.barColor)}
    topMargin={text("Top Margin", StyledScaleBar.defaultProps.topMargin)}
    leftMargin={text("Left Margin", StyledScaleBar.defaultProps.leftMargin)}
    rightMargin={text("Right Margin", StyledScaleBar.defaultProps.rightMargin)}
    thickness={text("Bar Thickness", StyledScaleBar.defaultProps.thickness)}
  />
);

export const WithChildren = () => (
  <StyledScaleBar>
    <StyledBarContainer>
      {[1, 2, 3].map((n) => (
        <div style={{ marginTop: `${n}0px` }} key={n}>
          {n}
        </div>
      ))}
    </StyledBarContainer>
  </StyledScaleBar>
);
