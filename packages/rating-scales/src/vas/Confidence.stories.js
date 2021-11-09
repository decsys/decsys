import { useState } from "react";
import { action } from "@storybook/addon-actions";
import Frame from "../core/Frame";
import { Confidence, confidenceInputStyles } from "./Confidence";

export default {
  title: "VAS + MVAS/Confidence",
  component: Confidence,
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
    <Frame frameHeight="300px">
      <input
        style={{ border: "thin solid grey" }}
        value={value}
        onChange={(e) =>
          setValue(e.target.value ? parseFloat(e.target.value) : null)
        }
      />
      <Confidence topMargin="300px" {...args} />
    </Frame>
  );
};
Basic.args = {
  isDisabled: false,
  confidenceText: "Rate your confidence!",
  confidenceTextOptions: {
    xAlign: "center",
  },
  style: confidenceInputStyles.scale,
};
