import { Scale } from "./MultiScale";
import { Frame } from "../core/Frame";
import { behaviour } from "./behaviours";
import { Flex, Stack } from "@chakra-ui/react";
import { useArgs } from "@storybook/client-api";

const behaviours = Object.keys(behaviour);

export default {
  title: "VAS + MVAS/MVAS Scale",
  component: Scale,
  argTypes: {
    behaviour: {
      options: behaviours,
      control: { type: "radio" },
    },
    onChange: { action: "MVAS Change" },
  },
};

export const Basic = (args) => {
  const [{ values }, updateArgs] = useArgs();

  const handleChange = (id, v) => {
    const newValues = { ...values, [id]: v };
    updateArgs({ values: newValues });
    args.onChange(id, v);
  };

  return (
    <Stack>
      {["left", "center", "right"].map((id) => (
        <Flex key={id}>
          {id.charAt(0).toUpperCase() + id.slice(1)}:
          <input
            style={{ border: "thin solid grey" }}
            value={values[id] ?? ""}
            onChange={(e) =>
              handleChange(
                id,
                e.target.value ? parseFloat(e.target.value) : null
              )
            }
          />
        </Flex>
      ))}
      <Frame frameHeight="300px">
        <Scale {...args} onChange={handleChange} />
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
};
