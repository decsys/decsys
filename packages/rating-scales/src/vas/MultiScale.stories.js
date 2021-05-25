import { useEffect } from "react";
import { MultiVisualAnalogScale } from "./MultiScale";
import { action } from "@storybook/addon-actions";

export default {
  title: "Rating Scales/MVAS",
  component: MultiVisualAnalogScale,
  decorators: [
    (s) => (
      <EventHandler onEvent={action("MVAS Completed")}>{s()}</EventHandler>
    ),
  ],
};

const EventHandler = ({ onEvent, children }) => {
  const handle = ({ detail }) => {
    onEvent(detail);
  };

  useEffect(() => {
    document.addEventListener("MvasCompleted", handle);
    return () => document.removeEventListener("MvasCompleted", handle);
  }, []);

  return children;
};

export const Basic = () => <MultiVisualAnalogScale />;

export const Sample = () => (
  <MultiVisualAnalogScale
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
