import { Scale } from "./Scale";
import { useState } from "react";
import Frame from "../core/Frame";
import { action } from "@storybook/addon-actions";

export default {
  title: "VAS + MVAS/VAS Scale",
  component: Scale,
};

export const Basic = (args) => {
  const [value, setValue] = useState(args.value);

  args = {
    ...args,
    value,
    onChange: (v) => {
      setValue(v);
      action("VAS Completed")(v);
    },
  };

  return (
    <Frame frameHeight="300px">
      <Scale {...args} />
      <input
        style={{ border: "thin solid grey" }}
        value={value}
        onChange={(e) =>
          setValue(e.target.value ? parseFloat(e.target.value) : null)
        }
      />
    </Frame>
  );
};
Basic.args = {};
