import ResponseItem, { behaviourKeyMap } from "./ResponseItem";
import Icon from "./Icon";

const behaviours = Object.keys(behaviourKeyMap);

export default {
  title: "Multi Visual Analog Scale",
  component: ResponseItem,
  argTypes: {
    behaviour: {
      options: behaviours,
      control: { type: "radio" },
    },
    buttons: {
      options: ["None", "Reset Last", "Reset All", "Both"],
      control: { type: "radio" },
    },
    useConfidenceInput: {
      options: [false, "input", "scale"],
      control: {
        type: "radio",
        labels: { [false]: "None", input: "Input", scale: "Scale" },
      },
    },
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
    setIsValidResponse: { action: "setIsValidResponse" },
  },
  args: {
    barLeftMargin: 10,
    barTopMargin: 50,
    barRightMargin: 10,
    barThickness: 8,
    barMaxValue: 100,
    barMinValue: 0,
    behaviour: behaviours[0],
    buttons: "None",
    useConfidenceInput: true,
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
