import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Visual Analog Scale Response",
  component: ResponseItem,
  argTypes: {
    useConfidenceInput: {
      options: ["None", "input", "scale"],
      control: {
        type: "radio",
        labels: { None: "None", input: "Input", scale: "Scale" },
      },
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
    scale: 60,
    confidence: 50,
  },
  {
    confidence: 50,
    scale: 0,
  },
  {
    confidence: 35,
    scale: 50,
  },
  {
    confidence: 55,
    scale: 40,
  },
  {
    confidence: 90,
    scale: 80,
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

const _context = {
  setNextEnabled: action("Next button toggled"),
  logResults: action("Results logged"),
};

export const Basic = (args) => <ResponseItem {...args} _context={_context} />;
Basic.args = {
  useConfidenceInput: "None",
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
