import { useState } from "react";
import { action } from "@storybook/addon-actions";
import Frame from "../core/Frame";
import { Confidence, confidenceInputStyles } from "./Confidence";

export default {
  title: "VAS + MVAS/Confidence",
  component: Confidence,
  argTypes: {
    style: {
      options: Object.keys(confidenceInputStyles),
      control: {
        type: "radio",
      },
    },
  },
};

export const Basic = (args) => {
  const [value, setValue] = useState(args.value);

  args = {
    ...args,
    value,
    onChange: (v) => {
      setValue(v);
      action("Confidence change")(v);
    },
  };

  return (
    <>
      <input
        style={{ border: "thin solid grey" }}
        value={value}
        onChange={(e) =>
          setValue(e.target.value ? parseFloat(e.target.value) : null)
        }
      />
      <Confidence {...args} />
    </>
  );
};
Basic.args = {
  isDisabled: false,
  confidenceText: "Rate your confidence!",
  confidenceTextOptions: {
    topMargin: "0%",
    xAlign: "center",
  },
  style: confidenceInputStyles.scale,
};
