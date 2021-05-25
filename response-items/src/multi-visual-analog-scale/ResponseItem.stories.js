import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Multi Visual Analog Scale Response",
  component: ResponseItem,
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

const _context = {
  setNextEnabled: action("Next button toggled"),
  logResults: action("Results logged"),
};

export const Basic = () => <ResponseItem _context={_context} />;

export const NumericStats = stats(
  ResponseItem.stats({ ...ResponseItem.defaultProps, ...props }, dummyResults)
);

export const MetadataIcon = () => <Icon width="24px" />;
