import React from "react";
import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";
import { Icon } from "./metadata";

export default {
  title: "Discrete Scale Response",
  component: ResponseItem,
};

const visProps = {
  numbers: {
    params: {
      radio1: 1,
      radio2: 2,
      radio3: 3,
      radio4: 4,
      radio5: 5,
      radio6: 6,
      radio7: 7,
      radio8: 8,
      radio9: 9,
      radio10: 10,
    },
    results: [
      { index: 0, value: 2 },
      { index: 1, value: 3 },
      { index: 2, value: 5 },
      { index: 2, value: 5 },
      { index: 3, value: 8 },
      { index: 4, value: 9 },
      { index: 4, value: 9 },
      { index: 0, value: 2 },
      { index: 4, value: 9 },
    ],
  },
  mixed: {
    params: {
      radio1: "Hello",
      radio2: "Goodbye",
      radio3: 3,
      radio4: "Hllo",
      radio5: true,
      radio6: "Other",
    },
    results: [
      { index: 0, value: "Hello" },
      { index: 0, value: "Hello" },
      { index: 2, value: 3 },
      { index: 2, value: 3 },
      { index: 3, value: "Hllo" },
      { index: 0, value: "Hello" },
      { index: 1, value: "Goodbye" },
      { index: 4, value: true },
      { index: 5, value: "Other" },
    ],
  },
};

const visualization = (stats) => () => (
  <div style={{ width: "40%" }}>{stats.visualizations[0].component}</div>
);

const stats = (stats) => () => (
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

export const Basic = () => (
  <ResponseItem
    radio1="1"
    radio2="2"
    radio3="3"
    radio3Secondary="" //override defaults; this is what the platform does anyway
    radio4="4"
    radio5="5"
    radio5Secondary="High"
    barLeftMargin={10}
    barTopMargin={50}
    barRightMargin={10}
    barThickness={8}
    _context={_context}
  />
);

export const NumericVisualisation = visualization(
  ResponseItem.stats(visProps.numbers.params, visProps.numbers.results)
);
export const NumericStats = stats(
  ResponseItem.stats(visProps.numbers.params, visProps.numbers.results)
);

export const MixedValueVisualisation = visualization(
  ResponseItem.stats(visProps.mixed.params, visProps.mixed.results)
);
export const MixedValueStats = stats(
  ResponseItem.stats(visProps.mixed.params, visProps.mixed.results)
);

export const MetadataIcon = () => <Icon width="24px" />;
