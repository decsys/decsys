import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Visual Analog Scale",
  component: ResponseItem,
  argTypes: {
    useConfidenceInput: {
      options: ["None", "Input", "Scale"],
      control: { type: "radio" },
    },
    barLeftMargin: { control: "number" },
    barRightMargin: { control: "number" },
    barTopMargin: { control: "number" },
    barThickness: { control: "number" },
    barColor: { control: "color" },
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
    dragMarkerColor: { control: "color" },
    dragMarkerInteractColor: { control: "color" },
    dragMarkerInitDistance: { control: "number" },
    confidenceText: { control: "text" },
    confidenceTextColor: { control: "color" },
    confidenceTextFontFamily: { control: "text" },
    confidenceTextFontSize: { control: "text" },
    setIsValidResponse: { action: "setIsValidResponse" },
    logResults: { action: "logResults" },
    clearResult: { action: "clearResult" },
  },
  args: {
    barLeftMargin: 10,
    barTopMargin: 50,
    barRightMargin: 10,
    barThickness: 8,
    barColor: "black",
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
    dragMarkerColor: "black",
    dragMarkerInteractColor: "#58d",
    dragMarkerInitDistance: 20,
    useConfidenceInput: "None",
    confidenceText: "How confident are you?",
    confidenceTextColor: "black",
    confidenceTextFontFamily: "Arial",
    confidenceTextFontSize: "18pt",
  },
};

const props = {
  barLeftMargin: 10,
  barTopMargin: 50,
  barRightMargin: 10,
  barThickness: 8,
  barMaxValue: 100,
  barMinValue: 0,
};

const dummyResults = [
  {
    value: 60,
    confidence: 50,
  },
  {
    confidence: 50,
    value: 0,
  },
  {
    confidence: 35,
    value: 50,
  },
  {
    confidence: 55,
    value: 40,
  },
  {
    confidence: 90,
    value: 80,
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

export const NumericStats = stats(
  ResponseItem.stats({ ...ResponseItem.defaultProps, ...props }, dummyResults)
);

export const NumericStatsMissingConfidence = stats(
  ResponseItem.stats(
    { ...ResponseItem.args, ...props },
    dummyResults.map((x) => ({ ...x, confidence: undefined }))
  )
);

export const MetadataIcon = () => <Icon width="24px" />;
