import {
  MultiVisualAnalogScale,
  useMultiVisualAnalogScale,
} from "./MultiScale";
import { action } from "@storybook/addon-actions";
import { behaviour } from "./behaviours";
import { Flex, Stack } from "@chakra-ui/react";

const behaviours = Object.keys(behaviour);

export default {
  title: "Rating Scales/MVAS",
  component: MultiVisualAnalogScale,
  argTypes: {
    behaviour: {
      options: behaviours,
      control: { type: "radio" },
    },
  },
};

export const Basic = (args) => {
  const {
    props: { values },
    handlers,
    setValues,
  } = useMultiVisualAnalogScale(args.values);

  // add actions for storybook benefit
  const handleChange = (id, v, all) => {
    handlers.onChange(id, v, all);
    action("onChange")(id, v, all);
  };
  const handleResetAll = () => {
    handlers.onResetAll();
    action("Reset All")();
  };
  const handleResetValue = (id) => {
    handlers.onResetValue(id);
    action("onResetValue")(id);
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
          value={values?.bestEstimate ?? ""}
          onChange={(e) =>
            setValues((old) => ({
              ...old,
              bestEstimate: e.target.value ? parseFloat(e.target.value) : null,
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
      <MultiVisualAnalogScale
        {...args}
        values={values}
        onChange={handleChange}
        onResetAll={handleResetAll}
        onResetValue={handleResetValue}
      />
    </Stack>
  );
};
Basic.args = {
  behaviour: behaviours[0],
  leftMarkerOptions: { label: "L" },
  rightMarkerOptions: { label: "R" },
  centerMarkerOptions: { label: "C" },
  values: {},
  buttons: { resetLast: true, resetAll: true },
};

export const Sample = Basic.bind({});
Sample.args = {
  ...Basic.args,
  barOptions: {
    minValue: 1,
    maxValue: 10,
    thickness: "1px",
  },
  labels: {
    min: "Easy",
    mid: "Ok",
    max: "Hard",
  },
  labelOptions: {
    yAlign: "above",
  },
  question: "How?",
  questionOptions: {
    xAlign: "center",
  },
  scaleMarkerOptions: {
    markerColor: "red",
    length: "50px",
    thickness: "1em",
    subColor: "green",
    subThickness: "0.2em",
    subLength: "20px",
    markers: 5,
    subdivisions: 10,
  },
  frameHeight: "300px",
  leftMarkerOptions: {
    label: "X",
    color: "#f71",
  },
  rightMarkerOptions: {
    color: "#1a4",
  },
  useConfidenceInput: "scale",
};
