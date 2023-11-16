import React from "react";
import { DiscreteScale } from "./DiscreteScale";

export default {
  title: "Discrete/Scale",
  component: DiscreteScale,
  tags: ["autodocs"],
  argTypes: {
    radioOptions: {
      control: "object",
      description: "Options for the scale's radio inputs.",
    },
    radios: {
      control: "object",
      description:
        "The actual radio input values, and optional secondary labels.",
    },
    questionOptions: {
      control: "object",
      description: "Options for the scale's question text.",
    },
    question: {
      control: "text",
      description: "Question text to display.",
    },
    barOptions: {
      control: "object",
      description: "Options for the scale's horizontal bar.",
    },
    frameHeight: {
      control: "text",
      description:
        "A valid CSS Dimension value for the height of the component's frame.",
    },
  },
};

// Basic story
export const Basic = (args) => <DiscreteScale {...args} />;

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

export const RatingScale = () => (
  <DiscreteScale
    radios={[
      ["1", "Very Low"],
      ["2", "Low"],
      ["3", "Medium"],
      ["4", "High"],
      ["5", "Very High"],
    ]}
    radioOptions={{
      labelAlignment: "below",
      initialIndex: 2,
      labelColor: "blue",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
    }}
    question="How do you rate your experience?"
    questionOptions={{
      xAlign: "left",
      textColor: "black",
      fontStyle: "italic",
    }}
    frameHeight="300px"
    barOptions={{
      barColor: "lightgray",
      barHeight: "20px",
      barWidth: "100%",
    }}
  />
);
