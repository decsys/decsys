import React from "react";
import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Ellipse Scale",
  component: ResponseItem,
  argTypes: {
    setNextEnabled: { action: "setNextEnabled" },
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
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
