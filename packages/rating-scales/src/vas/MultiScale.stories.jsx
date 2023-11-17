import { Scale } from "./MultiScale";
import { useState } from "react";
import { Frame } from "../core/Frame";
import { behaviour } from "./behaviours";
import { Flex, Stack, Input } from "@chakra-ui/react";

const behaviours = Object.keys(behaviour);

export default {
  title: "VAS + MVAS/MVAS Scale",
  component: Scale,
  argTypes: {
    behaviour: {
      options: behaviours,
      control: { type: "radio" },
    },
    onChange: { action: "valuesChanged" },
    frameHeight: {
      control: { type: "text" },
      defaultValue: "300px",
    },
  },
};

export const Basic = (args) => {
  const [values, setValues] = useState(args.values);

  const handleChange = (position, value) => {
    const newValues = { ...values, [position]: value };
    setValues(newValues);
    args.onChange(position, value);
  };

  return (
    <Stack spacing={4}>
      {["left", "center", "right"].map((position) => (
        <Flex key={position} align="center">
          <span>{position.charAt(0).toUpperCase() + position.slice(1)}:</span>
          <Input
            ml={2}
            borderColor="gray.300"
            value={values?.[position] ?? ""}
            onChange={(e) =>
              handleChange(
                position,
                e.target.value ? parseFloat(e.target.value) : null
              )
            }
          />
        </Flex>
      ))}
      <Frame frameHeight={args.frameHeight || "300px"}>
        <Scale {...args} />
      </Frame>
    </Stack>
  );
};
Basic.args = {
  behaviour: behaviours[0],
  leftMarkerOptions: { label: "L" },
  rightMarkerOptions: { label: "R" },
  centerMarkerOptions: { label: "C" },
  values: {},
  frameHeight: "300px",
};
