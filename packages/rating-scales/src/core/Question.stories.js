import Question from "./Question";
import { text, optionsKnob } from "@storybook/addon-knobs";

export default {
  title: "core/Question",
  component: Question,
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

export const Basic = () => <Question>Hello there!</Question>;

export const WithKnobs = () => (
  <Question
    textColor={text("Text Color", Question.defaultProps.textColor)}
    topMargin={text("Top Margin", Question.defaultProps.topMargin)}
    xMargin={text("Horizontal Margin", Question.defaultProps.xMargin)}
    fontFamily={text("Font Family", Question.defaultProps.fontFamily)}
    fontSize={text("Font Size", Question.defaultProps.fontSize)}
    xAlign={optionsKnob(
      "Horizontal Alignment",
      { left: "left", center: "center", right: "right" },
      "left",
      { display: "inline-radio" }
    )}
  >
    {text("Question Text", "Hello there!")}
  </Question>
);
