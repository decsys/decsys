import { useVisualAnalogScale, VisualAnalogScale } from "./Scale";
import { action } from "@storybook/addon-actions";

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
  },
};

export const Basic = (args) => {
  const {
    props,
    handlers: { onChange, onConfidenceChange },
  } = useVisualAnalogScale(args.value, args.confidenceValue);

  const handleChange = (v) => {
    onChange(v);
    action("VAS Changed")(v);
  };
  const handleConfidenceChange = (v) => {
    onConfidenceChange(v);
    action("Confidence Changed")(v);
  };

  return (
    <VisualAnalogScale
      {...args}
      {...props}
      onChange={handleChange}
      onConfidenceChange={handleConfidenceChange}
    />
  );
};

Basic.args = {
  useConfidenceInput: false,
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
