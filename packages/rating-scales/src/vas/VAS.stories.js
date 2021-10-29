import { VisualAnalogScale } from "./Scale";
import { action } from "@storybook/addon-actions";

export default {
  title: "Rating Scales/VAS",
  component: VisualAnalogScale,
};

export const Basic = () => (
  <VisualAnalogScale onChange={action("VAS Completed")} />
);

export const Sample = () => (
  <VisualAnalogScale
    barOptions={{
      minValue: 1,
      maxValue: 10,
      thickness: "1px",
    }}
    labels={{
      min: "Easy",
      mid: "Ok",
      max: "Hard",
    }}
    labelOptions={{
      yAlign: "above",
    }}
    question="How?"
    questionOptions={{
      xAlign: "center",
    }}
    scaleMarkerOptions={{
      markerColor: "red",
      length: "50px",
      thickness: "1em",
      subColor: "green",
      subThickness: "0.2em",
      subLength: "20px",
      markers: 5,
      subdivisions: 10,
    }}
    frameHeight="300px"
    onChange={action("VAS Completed")}
  />
);
