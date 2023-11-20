import { MultiVisualAnalogScale } from "./MultiVisualAnalogScale";
import { behaviour } from "./behaviours";
import { Flex, Stack } from "@chakra-ui/react";
import { useArgs } from "@storybook/client-api";

const behaviours = Object.keys(behaviour);

export default {
  title: "Rating Scales/MVAS",
  component: MultiVisualAnalogScale,
  argTypes: {
    behaviour: {
      options: behaviours,
      control: { type: "radio" },
    },
    useConfidenceInput: {
      options: [false, "input", "scale"],
      control: {
        type: "radio",
        labels: { [false]: "None", input: "Input", scale: "Scale" },
      },
    },
    onChange: { action: "MVas Changed" },
    onResetAll: { action: "MVas Reset All" },
    onResetValue: { action: "Mvas Reset Value" },
  },
};

export const Basic = (args) => {
  const [{ values }, updateArgs] = useArgs();

  // add actions for storybook benefit
  const handleChange = (id, v, all) => {
    updateArgs({ values: { ...all, [id]: v } });
    args.onChange(id, v, all);
  };
  const handleResetAll = () => {
    updateArgs({ values: {} });
    args.onResetAll();
  };
  const handleResetValue = (id) => {
    updateArgs({ values: { ...values, [id]: undefined } });
    args.onResetValue(id);
  };

  return (
    <Stack>
      <Flex>
        Left:
        <input
          style={{ border: "thin solid grey" }}
          value={values?.left ?? ""}
          onChange={(e) =>
            updateArgs({
              values: {
                ...values,
                left: e.target.value ? parseFloat(e.target.value) : null,
              },
            })
          }
        />
      </Flex>
      <Flex>
        Center:
        <input
          style={{ border: "thin solid grey" }}
          value={values?.bestEstimate ?? ""}
          onChange={(e) =>
            updateArgs({
              values: {
                ...values,
                bestEstimate: e.target.value
                  ? parseFloat(e.target.value)
                  : null,
              },
            })
          }
        />
      </Flex>
      <Flex>
        Right:
        <input
          style={{ border: "thin solid grey" }}
          value={values?.right ?? ""}
          onChange={(e) =>
            updateArgs({
              values: {
                ...values,
                right: e.target.value ? parseFloat(e.target.value) : null,
              },
            })
          }
        />
      </Flex>
      <MultiVisualAnalogScale
        {...args}
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
  useConfidenceInput: "input",
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
