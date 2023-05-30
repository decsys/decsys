import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Visual Analog Scale",
  component: ResponseItem,
  argTypes: {
    useConfidenceInput: {
      options: ["None", "input", "scale"],
      control: { type: "radio" },
    },
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

const _context = {
  setIsValidResponse: (isValid) => {
    console.log("set valid response", isValid);
  },
  logResults: (results) => {
    console.log("log result", results);
  },
  clearResult: (results) => {
    console.log("results cleared", results);
  },
};

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

export const Basic = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    ...props,
  },
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
