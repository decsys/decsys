import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Component from "./Component";

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

storiesOf("Component", module)
  .add("Default", () => <Component {...actions} />)
  .add(
    "Numeric Visualisation",
    visualization(
      Component.stats(
        { ...Component.defaultProps, ...props },
        dummyEllipseResults
      )
    )
  )
  .add(
    "Numeric stats",
    stats(
      Component.stats(
        { ...Component.defaultProps, ...props },
        dummyEllipseResults
      )
    )
  );
