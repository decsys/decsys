import { VisualAnalogScale } from "./VisualAnalogScale";
import { useArgs } from "@storybook/client-api";

export default {
  title: "Rating Scales/VAS",
  component: VisualAnalogScale,
  argTypes: {
    useConfidenceInput: {
      options: [false, "input", "scale"],
      control: {
        type: "radio",
        labels: { [false]: "None", input: "Input", scale: "Scale" },
      },
    },
    onChange: { action: "valuesChanged" },
  },
};

export const Basic = (args) => {
  const [_, updateArgs] = useArgs(); // eslint-disable-line

  const handleChange = (id, v, values) => {
    updateArgs({ values: { ...values, [id]: v } });
    args.onChange(id, v, values);
  };

  return <VisualAnalogScale {...args} onChange={handleChange} />;
};

Basic.args = {
  useConfidenceInput: false,
  values: {},
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
};
