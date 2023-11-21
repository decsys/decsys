import { useEffect } from "react";
import { EllipseScale } from "./EllipseScale";

export default {
  title: "Ellipse/Ellipse",
  component: EllipseScale,
  tags: ["autodocs"],
  argTypes: {
    penColor: {
      control: "color",
    },
    min: {
      control: "text",
      description: "Min range value",
      type: { summary: "Text" },
    },
    mid: {
      control: "text",
      description: "Mid range value",
      type: { summary: "Text" },
    },
    max: {
      control: "text",
      description: "Max range value",
      type: { summary: "Text" },
    },
    markerColor: {
      control: "color",
    },
    length: {
      control: "text",
      description: "Length of marker",
    },
    thickness: {
      control: "text",
      description: "thickness of marker",
    },
    question: {
      control: "text",
    },
    xAlign: {
      control: "radio",
      options: ["left", "center", "right"],
    },
    onEllipseCompleted: { action: "Ellipse Completed" },
  },
  //default controls
  args: {
    penColor: "black",
    markerColor: "red",
    question: "Draw an ellipse to select the range",
    xAlign: "center",
    length: "100px",
    thickness: "2px",
    min: "min",
    mid: "mid",
    max: "max",
  },
  decorators: [
    (Story, context) => (
      <EventHandler
        eventName="EllipseCompleted"
        onEvent={context.args.onEllipseCompleted}
      >
        <Story />
      </EventHandler>
    ),
  ],
};

const EventHandler = ({ eventName, onEvent, children }) => {
  const handle = ({ detail }) => onEvent(detail);

  useEffect(() => {
    document.addEventListener(eventName, handle);
    return () => document.removeEventListener(eventName, handle);
  }, [eventName]);

  return <>{children}</>;
};

/**
 * This is the Basic Ellipse Scale where you can change the color of the pen, add range values, change marker constants and a question
 */
export const Basic = (args) => (
  <EllipseScale
    barOptions={{
      minValue: 1,
      maxValue: 10,
      thickness: "1px",
    }}
    labels={{
      min: args.min,
      mid: args.mid,
      max: args.max,
    }}
    penOptions={{
      color: args.penColor,
    }}
    rangeMarkerOptions={{
      markerColor: args.markerColor,
      length: args.length,
      thickness: args.thickness,
    }}
    question={args.question}
    questionOptions={{
      xAlign: args.xAlign,
    }}
  />
);

export const OldSample = (args) => (
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
      color: args.penColor,
    }}
  />
);
