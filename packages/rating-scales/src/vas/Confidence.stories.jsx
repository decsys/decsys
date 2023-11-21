import { useState } from "react";
import { Confidence, confidenceInputStyles } from "./Confidence";

export default {
  title: "VAS + MVAS/Confidence",
  component: Confidence,
  argTypes: {
    onChange: { action: "confidenceChanged" },
    question: { control: "text" },
    xAlign: {
      control: "radio",
      options: ["left", "center", "right"],
    },
    topMargin: {
      control: "text",
    },
    isDisabled: {
      control: "boolean",
    },
  },
  //default controls
  args: {
    isDisabled: false,
    question: "Rate your confidence",
    xAlign: "center",
    topMargin: "0%",
  },
};

export const Basic = (args) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (v) => {
    setValue(v);
    args.onChange(v);
  };

  return (
    <>
      <input style={{ border: "thin solid grey" }} value={value} />
      <Confidence
        isDisabled={args.isDisabled}
        confidenceText={args.question}
        confidenceTextOptions={{
          topMargin: args.topMargin,
          xAlign: args.xAlign,
        }}
        value={value}
        onChange={handleChange}
        style={confidenceInputStyles.scale}
      />
    </>
  );
};
