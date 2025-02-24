import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Ellipse Scale",
  component: ResponseItem,
  argTypes: {
    setNextEnabled: { action: "setNextEnabled" },
    logResults: { action: "logResults" },
    barLeftMargin: { control: "number" },
    barRightMargin: { control: "number" },
    barTopMargin: { control: "number" },
    barColor: { control: "color" },
    barThickness: { control: "number" },
    barMinValue: { control: "number" },
    barMaxValue: { control: "number" },
    labelColor: { control: "color" },
    fontFamily: { control: "text" },
    fontSize: { control: "text" },
    labelAlignment: {
      options: ["above", "below"],
      control: { type: "radio" },
    },
    minLabel: { control: "text" },
    midLabel: { control: "text" },
    maxLabel: { control: "text" },
    penColor: { control: "color" },
    penThickness: { control: "number" },
    rangeMarkerColor: { control: "color" },
    rangeMarkerHeight: { control: "number" },
    rangeMarkerThickness: { control: "number" },
    scaleMarkerColor: { control: "color" },
    scaleMarkerThickness: { control: "number" },
    scaleMarkerHeight: { control: "number" },
    scaleSubdivisionColor: { control: "color" },
    scaleSubdivisionThickness: { control: "number" },
    scaleSubdivisionHeight: { control: "number" },
    scaleMarkers: { control: "number" },
    scaleSubdivisions: { control: "number" },
  },
  args: {
    barLeftMargin: 10,
    barRightMargin: 10,
    barTopMargin: 40,
    barColor: "#ff0000", // Red
    barThickness: 5,
    barMinValue: 0,
    barMaxValue: 100,
    labelColor: "#0000ff", // Blue
    fontFamily: "Arial",
    fontSize: "16pt",
    labelAlignment: "below",
    minLabel: "Minimum",
    midLabel: "Middle",
    maxLabel: "Maximum",
    penColor: "#00ff00", // Green
    penThickness: 2,
    rangeMarkerColor: "#000000", // Black
    rangeMarkerHeight: 100,
    rangeMarkerThickness: 2,
    scaleMarkerColor: "black",
    scaleMarkerThickness: 4,
    scaleMarkerHeight: 30,
    scaleSubdivisionColor: "black",
    scaleSubdivisionThickness: 4,
    scaleSubdivisionHeight: 15,
    scaleMarkers: 5,
    scaleSubdivisions: 4,
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
