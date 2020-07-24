import React, { useState, useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { text, number } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Component from "./Component";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const dummyResults = [
  {
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    text:
      "Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Cursus sit amet dictum sit. Elementum tempus egestas sed sed risus pretium quam. Nunc non blandit massa enim nec dui nunc. Scelerisque purus semper eget duis at. Viverra vitae congue eu consequat ac felis donec et odio. Lacus viverra vitae congue eu consequat ac felis. Quisque egestas diam in arcu cursus. Tortor at auctor urna nunc id cursus metus. Pellentesque sit amet porttitor eget dolor morbi. Sed nisi lacus sed viverra tellus in hac. In nibh mauris cursus mattis molestie a iaculis at. Commodo nulla facilisi nullam vehicula ipsum a"
  },
  {
    text:
      "eo urna molestie at elementum eu facilisis sed odio morbi. Ac tortor vitae purus faucibus ornare suspendisse sed. Est sit amet facilisis magna. Tincidunt tortor aliquam nulla facilisi cras fermentum. At varius vel pharetra vel turpis nunc eget"
  },
  {
    text:
      "Nascetur ridiculus mus mauris vitae ultricies leo. Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Consectetur adipiscing elit ut aliquam purus sit amet luctus venenatis. Natoque penatibus et magnis dis parturient. Convallis aenean et tortor at risus viverra adipiscing at in. Ut diam quam nulla porttitor massa id neque aliquam. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Ac turpis egestas integer eget aliquet nibh. Odio euismod lacinia at quis risus sed."
  },
  {
    text:
      "Rhoncus est pellentesque elit ullamcorper dignissim. Euismod lacinia at quis risus sed vulputate odio ut enim. Maecenas accumsan lacus vel facilisis volutpat. Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Nibh ipsum consequat nisl vel pretium lectus quam id. Turpis cursus in hac habitasse platea dictumst quisque sagittis purus. "
  }
];

const visualization = stats => () => stats.visualizations[0].component;

const Refresh = ({ initialData, onRefresh, changeData }) => {
  const [toggle, setToggle] = useState(true);
  const [data, setData] = useState(initialData);

  // refresh the data, but it will either be the same
  // each time, or different each time, based on
  // `changeData`
  useInterval(() => {
    setToggle(!toggle);
    setData(
      changeData && toggle
        ? [...initialData, { text: "extra data point" }]
        : [...initialData]
    );
    onRefresh();
  }, 5000);

  // mimic the platform's stats renderer
  const getStatsComponent = () => {
    const stats = Component.stats({}, data);
    return stats.visualizations[0].component;
  };

  return getStatsComponent();
};

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
  logResults: action("Results logged"),
  setNextEnabled: action("Next button enabled")
};

storiesOf("Component", module)
  .add("Default", () => (
    <Component
      {...actions}
    />
  ))
  .add("Initial Text", () => (
    <Component
      text={text("Text", "Hello")}
      maxLength={number("Max Length", 50)}
      {...actions}
    />
  ))
  .add("Visualisation", visualization(Component.stats({}, dummyResults)))
  .add("Static Data Auto Refresh", () => (
    <Refresh initialData={dummyResults} onRefresh={action("refresh")} />
  ))
  .add("Dynamic Data Auto Refresh", () => (
    <Refresh
      initialData={dummyResults}
      onRefresh={action("refresh")}
      changeData={true}
    />
  ))
  .add("Stats", stats(Component.stats({}, dummyResults)));
