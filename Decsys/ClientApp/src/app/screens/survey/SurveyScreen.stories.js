import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import { PureSurveyScreen } from "./SurveyScreen";
import { action } from "@storybook/addon-actions";

const page = {
  id: 1,
  components: [
    {
      id: 1,
      type: "heading",
      params: {
        text: "Hello there"
      }
    },
    {
      id: 1,
      type: "paragraph",
      params: {
        text: `Let's have some information text here for you to read...
        
![](https://cataas.com/cat)`
      }
    }
  ]
};

const actions = {
  logEvent: action("Event logged"),
  onClick: action("Next Button clicked")
};

storiesOf("SurveyScreen", module)
  .addDecorator(StoryRouter())
  .add("Empty", () => (
    <PureSurveyScreen page={{ id: 1, components: [] }} {...actions} />
  ))
  .add("Content", () => <PureSurveyScreen page={page} {...actions} />);
