import ResponseItem, { behaviourKeyMap } from "./ResponseItem";
import Icon from "./Icon";

const behaviours = Object.keys(behaviourKeyMap);

export default {
  title: "Multi Visual Analog Scale",
  component: ResponseItem,
  argTypes: {
    behaviour: {
      options: ["Speirs-Bridge 2010", "Hesketh, Pryor & Hesketh 1988"],
      control: { type: "radio" },
    },
    buttons: {
      options: ["None", "Undo", "Reset", "Both"],
      control: { type: "radio" },
    },
    useConfidenceInput: {
      options: ["None", "Input", "Scale"],
      control: { type: "radio" },
    },
    confidenceText: { control: "text" },
    confidenceTextColor: { control: "color" },
    confidenceTextFontFamily: { control: "text" },
    confidenceTextFontSize: { control: "text" },
    dragMarkerInteractColor: { control: "color" },
    dragMarkerInitDistance: { control: "number" },
    leftDragMarkerColor: { control: "color" },
    leftDragMarkerLabel: { control: "text" },
    rightDragMarkerColor: { control: "color" },
    rightDragMarkerLabel: { control: "text" },
    centerDragMarkerColor: { control: "color" },
    centerDragMarkerLabel: { control: "text" },
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
    scaleMarkerColor: { control: "color" },
    scaleMarkerThickness: { control: "number" },
    scaleMarkerHeight: { control: "number" },
    scaleSubdivisionColor: { control: "color" },
    scaleSubdivisionThickness: { control: "number" },
    scaleSubdivisionHeight: { control: "number" },
    scaleMarkers: { control: "number" },
    scaleSubdivisions: { control: "number" },
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
    setIsValidResponse: { action: "setIsValidResponse" },
  },
  args: {
    behaviour: "Speirs-Bridge 2010",
    buttons: "None",
    useConfidenceInput: "Input",
    confidenceText: "How confident are you?",
    confidenceTextColor: "black",
    confidenceTextFontFamily: "Arial",
    confidenceTextFontSize: "18pt",
    dragMarkerInteractColor: "#58d",
    dragMarkerInitDistance: 20,
    leftDragMarkerColor: "red",
    leftDragMarkerLabel: "L",
    rightDragMarkerColor: "green",
    rightDragMarkerLabel: "R",
    centerDragMarkerColor: "blue",
    centerDragMarkerLabel: "C",
    barLeftMargin: 10,
    barRightMargin: 10,
    barTopMargin: 50,
    barColor: "black",
    barThickness: 4,
    barMinValue: 0,
    barMaxValue: 100,
    labelColor: "black",
    fontFamily: "Times New Roman",
    fontSize: "18pt",
    labelAlignment: "below",
    minLabel: "Min",
    midLabel: "Mid",
    maxLabel: "Max",
    scaleMarkerColor: "black",
    scaleMarkerThickness: 4,
    scaleMarkerHeight: 30,
    scaleSubdivisionColor: "black",
    scaleSubdivisionThickness: 2,
    scaleSubdivisionHeight: 15,
    scaleMarkers: 5,
    scaleSubdivisions: 4,
  },
};

const dummyResults = [
  {
    left: 60,
    right: 90,
    bestEstimate: 75,
    confidence: 50,
  },
  {
    left: 0,
    right: 100,
    bestEstimate: 75,
    confidence: 50,
  },
  {
    left: 50,
    right: 90,
    bestEstimate: 60,
    confidence: 35,
  },
  {
    left: 40,
    right: 90,
    bestEstimate: 55,
    confidence: 55,
  },
  {
    left: 80,
    right: 90,
    bestEstimate: 85,
    confidence: 90,
  },
];

const stats = (stats) => () =>
  (
    <div>
      {Object.keys(stats.stats).map((x) => (
        <div key={x}>
          <h4>{x}</h4>
          <p>{stats.stats[x]}</p>
        </div>
      ))}
    </div>
  );

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};

const props = {
  barLeftMargin: 10,
  barTopMargin: 50,
  barRightMargin: 10,
  barThickness: 8,
  barMaxValue: 100,
  barMinValue: 0,
};

export const NumericStats = stats(
  ResponseItem.stats({ ...ResponseItem.defaultProps, ...props }, dummyResults)
);

export const NumericStatsMissingConfidence = stats(
  ResponseItem.stats(
    { ...ResponseItem.defaultProps, ...props },
    dummyResults.map((x) => ({ ...x, confidence: undefined }))
  )
);

export const MetadataIcon = () => <Icon width="24px" />;
