import React, { useEffect } from "react";
import EllipseScale from "./Scale";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";

export default {
  title: "Rating Scales/Ellipse",
  component: EllipseScale,
  decorators: [
    (s) => (
      <EventHandler onEvent={action("Ellipse Completed")}>{s()}</EventHandler>
    ),
  ],
};

const EventHandler = ({ onEvent, children }) => {
  const handle = ({ detail }) => {
    onEvent(detail);
  };

  useEffect(() => {
    document.addEventListener("EllipseCompleted", handle);
    return () => document.removeEventListener("EllipseCompleted", handle);
  }, []);

  return children;
};

export const Basic = () => <EllipseScale />;

export const WithLabels = () => (
  <EllipseScale labels={{ min: "Min", max: "Max" }} />
);

export const OldSample = () => (
  <EllipseScale
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
    minRangeValue={4.5}
    maxRangeValue={10}
    rangeMarkerOptions={{
      markerColor: "blue",
      length: "100px",
      thickness: "1px",
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
    penOptions={{
      color: text("Pen Color", "red"),
      thickness: 1,
    }}
  />
);
