import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Component from "./Component";

const dummyDiscreteResults = {
  numbers: [
    { index: 0, value: 1 },
    { index: 1, value: 2 },
    { index: 2, value: 3 },
    { index: 2, value: 3 },
    { index: 3, value: 4 },
    { index: 4, value: 5 },
    { index: 4, value: 5 },
    { index: 0, value: 1 },
    { index: 4, value: 5 }
  ],
  mixed: [
    { index: 0, value: "Hello" },
    { index: 0, value: "Hello" },
    { index: 2, value: 3 },
    { index: 2, value: 3 },
    { index: 3, value: "Hllo" },
    { index: 0, value: "Hello" },
    { index: 1, value: "Goodbye" },
    { index: 4, value: true },
    { index: 5, value: "Other" }
  ]
};

const visualization = stats => () => (
  <div style={{ width: "40%" }}>{stats.visualizations[0].component}</div>
);

const stats = stats => () => (
  <div>
    {Object.keys(stats.stats).map(x => (
      <div key={x}>
        <h4>{x}</h4>
        <p>{stats.stats[x]}</p>
      </div>
    ))}
  </div>
);

const actions = {
  setNextEnabled: action("Next button toggled"),
  logResults: action("Results logged")
};

storiesOf("Component", module)
  .add("Default", () => (
    <Component
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
      {...actions}
    />
  ))
  .add(
    "Numeric Visualisation",
    visualization(Component.stats({}, dummyDiscreteResults.numbers))
  )
  .add("Numeric stats", stats(Component.stats({}, dummyDiscreteResults.numbers)))
  .add(
    "Mixed value Visualisation",
    visualization(Component.stats({}, dummyDiscreteResults.mixed))
  )
  .add(
    "Mixed value stats",
    stats(Component.stats({}, dummyDiscreteResults.mixed))
  );
