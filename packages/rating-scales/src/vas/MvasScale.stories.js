import { Scale } from "./MultiScale";
import { useState } from "react";
import Frame from "../core/Frame";
import { action } from "@storybook/addon-actions";
import { behaviour } from "./behaviours";
import { Flex, Stack } from "@chakra-ui/react";

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
  const [values, setValues] = useState(args.values);

  args = {
    ...args,
    values,
    onChange: (id, v) => {
      setValues((old) => ({ ...old, [id]: v }));
      action("VAS Completed")(id, v);
    },
  };

  return (
    <Stack>
      <Flex>
        Left:
        <input
          style={{ border: "thin solid grey" }}
          value={values?.left ?? ""}
          onChange={(e) =>
            setValues((old) => ({
              ...old,
              left: e.target.value ? parseFloat(e.target.value) : null,
            }))
          }
        />
      </Flex>
      <Flex>
        Center:
        <input
          style={{ border: "thin solid grey" }}
          value={values?.center ?? ""}
          onChange={(e) =>
            setValues((old) => ({
              ...old,
              center: e.target.value ? parseFloat(e.target.value) : null,
            }))
          }
        />
      </Flex>
      <Flex>
        Right:
        <input
          style={{ border: "thin solid grey" }}
          value={values?.right ?? ""}
          onChange={(e) =>
            setValues((old) => ({
              ...old,
              right: e.target.value ? parseFloat(e.target.value) : null,
            }))
          }
        />
      </Flex>
      <Frame frameHeight="300px">
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
};
