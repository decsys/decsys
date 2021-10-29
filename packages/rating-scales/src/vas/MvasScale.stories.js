import { Scale } from "./MultiScale";
import { useState } from "react";
import Frame from "../core/Frame";
import { action } from "@storybook/addon-actions";
import { behaviour } from "./behaviours";

const behaviours = Object.keys(behaviour);

export default {
  title: "VAS + MVAS/MVAS Scale",
  component: Scale,
  argTypes: {
    behaviour: {
      options: behaviours,
      control: { type: "radio" },
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
Basic.args = {
  behaviour: behaviours[0],
  leftMarkerOptions: { label: "L" },
  rightMarkerOptions: { label: "R" },
  centerMarkerOptions: { label: "C" },
};
