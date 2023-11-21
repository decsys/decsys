import React from "react";
import { DiscreteScale } from "./DiscreteScale";

export default {
  title: "Discrete/Scale",
  component: DiscreteScale,
  tags: ["autodocs"],
  argTypes: {
    radios: {
      control: "array",
      description: "Arrays for the range",
    },
    barColor: {
      control: "color",
    },
    labelColor: {
      control: "color",
    },
  },
  //default controls
  args: {
    radios: [
      ["1", "Very Low"],
      ["2", "Low"],
      ["3", "Medium"],
      ["4", "High"],
      ["5", "Very High"],
    ],
    labelAlignment: "below",
    initialIndex: 2,
    labelColor: "blue",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    question: "How do you rate your experience?",
    frameHeight: "300px",
    barColor: "lightgray",
    barHeight: "20px",
    barWidth: "100%",
  },
};

// Basic story
export const Basic = (args) => (
  <DiscreteScale
    radios={args.radios}
    radioOptions={{
      labelAlignment: args.labelAlignment,
      initialIndex: args.initialIndex,
      labelColor: args.labelColor,
      fontFamily: args.fontFamily,
      fontSize: args.fontSize,
    }}
    question={args.question}
    questionOptions={{
      xAlign: args.xAlign,
      textColor: args.textColor,
      fontStyle: args.fontStyle,
    }}
    frameHeight={args.frameHeight}
    barOptions={{
      barColor: args.barColor,
      barHeight: args.barHeight,
      barWidth: args.barWidth,
    }}
  />
);

// Sample story with predefined options
export const OldSample = () => (
  <DiscreteScale
    radios={[["1", "Low"], ["2"], ["3"], ["4"], ["5", "High"]]}
    radioOptions={{
      labelAlignment: "above",
      initialIndex: 0,
      labelColor: "green",
      fontFamily: "Comic Sans MS",
    }}
    question="How much do you like this question?"
    questionOptions={{
      xAlign: "center",
      textColor: "orange",
    }}
  />
);
