import React from "react";
import ResponseItem from "./ResponseItem";

export default {
  title: "Ellipse Scale",
  component: ResponseItem,
  argTypes: {
    setIsValidResponse: { action: "setIsValidResponse" },
    logResults: { action: "logResults" },
    barColor: { control: "color" },
    labelColor: { control: "color" },
    rangeMarkerColor: { control: "color" },
    penColor: { control: "color" },
  },
  args: {
    barMinValue: 0,
    barMaxValue: 100,
    barLeftMargin: 10,
    barRightMargin: 10,
    barTopMargin: 40,
    barColor: "#ff0000", // Red
    barThickness: 5,
    labelColor: "#0000ff", // Blue
    fontSize: 16,
    minLabel: "Minimum",
    maxLabel: "Maximum",
    penColor: "#00ff00", // Green
    penThickness: 2,
    rangeMarkerColor: "#000000",
    rangeMarkerHeight: 100,
    rangeMarkerThickness: 2,
  },
};

export const Basic = (args) => {
  const _context = {
    setIsValidResponse: args.setIsValidResponse,
    logResults: args.logResults,
  };
  return <ResponseItem {...args} _context={_context} />;
};
