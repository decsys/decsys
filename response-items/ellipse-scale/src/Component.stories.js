import React from "react";
import { action } from "@storybook/addon-actions";
import Component from "./Component";
import { Icon } from "./metadata";

export default {
  title: "Ellipse Scale Response",
  component: Component,
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

const visualization = (stats) => () => (
  <div style={{ marginLeft: "3em", width: "40%" }}>
    {stats.visualizations[0].component}
  </div>
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

const actions = {
  setNextEnabled: action("Next button toggled"),
  logResults: action("Results logged"),
};

export const Basic = () => <Component {...actions} />;

export const NumericVisualisation = visualization(
  Component.stats({ ...Component.defaultProps, ...props }, dummyEllipseResults)
);

export const NumericStats = stats(
  Component.stats({ ...Component.defaultProps, ...props }, dummyEllipseResults)
);

export const MetadataIcon = () => <Icon width="24px" />;
