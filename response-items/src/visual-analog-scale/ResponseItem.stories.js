import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";
import Icon from "./Icon";
import Plot from "react-plotly.js";

export default {
  title: "Visual Analog Scale Response",
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

const dummyEllipseResults = [
  {
    minRangeValue: 60,
    maxRangeValue: 90,
    completed: true,
  },
  {
    minRangeValue: 0,
    maxRangeValue: 100,
    completed: true,
  },
  {
    minRangeValue: 50,
    maxRangeValue: 90,
    completed: true,
  },
  {
    minRangeValue: 40,
    maxRangeValue: 90,
    completed: true,
  },
  {
    minRangeValue: 80,
    maxRangeValue: 90,
    completed: true,
  },
];

const visualization = (stats) => () =>
  <Plot {...stats.visualizations[0].plotly} />;

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

export const NumericVisualisation = visualization(
  ResponseItem.stats(
    { ...ResponseItem.defaultProps, ...props },
    dummyEllipseResults
  )
);

export const NumericStats = stats(
  ResponseItem.stats(
    { ...ResponseItem.defaultProps, ...props },
    dummyEllipseResults
  )
);

export const MetadataIcon = () => <Icon width="24px" />;
