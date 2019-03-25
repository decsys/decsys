import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import { PureSurveyScreen } from "./SurveyScreen";

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

storiesOf("SurveyScreen", module)
  .addDecorator(StoryRouter())
  .add("Default", () => <PureSurveyScreen page={page} />);
