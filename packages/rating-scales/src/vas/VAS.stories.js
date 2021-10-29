import { useEffect } from "react";
import { VisualAnalogScale } from "./Scale";
import { action } from "@storybook/addon-actions";

export default {
  title: "Rating Scales/VAS",
  component: VisualAnalogScale,
  decorators: [
    (s) => <EventHandler onEvent={action("VAS Completed")}>{s()}</EventHandler>,
  ],
};

const EventHandler = ({ onEvent, children }) => {
  const handle = ({ detail }) => {
    onEvent(detail);
  };

  useEffect(() => {
    document.addEventListener("VasCompleted", handle);
    return () => document.removeEventListener("VasCompleted", handle);
  }, []);

  return children;
};

export const Basic = () => <VisualAnalogScale />;

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
  />
);
