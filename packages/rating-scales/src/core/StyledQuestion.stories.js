import React from "react";
import StyledQuestion from "./StyledQuestion";
import { text, optionsKnob } from "@storybook/addon-knobs";

export default {
  title: "core/StyledQuestion",
  component: StyledQuestion,
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

export const Basic = () => <StyledQuestion>Hello there!</StyledQuestion>;

export const WithKnobs = () => (
  <StyledQuestion
    textColor={text("Text Color", StyledQuestion.defaultProps.textColor)}
    topMargin={text("Top Margin", StyledQuestion.defaultProps.topMargin)}
    xMargin={text("Horizontal Margin", StyledQuestion.defaultProps.xMargin)}
    fontFamily={text("Font Family", StyledQuestion.defaultProps.fontFamily)}
    fontSize={text("Font Size", StyledQuestion.defaultProps.fontSize)}
    xAlign={optionsKnob(
      "Horizontal Alignment",
      { left: "left", center: "center", right: "right" },
      "left",
      { display: "inline-radio" }
    )}
  >
    {text("Question Text", "Hello there!")}
  </StyledQuestion>
);
