import React from "react";
import SurveyPage from "components/SurveyPage";
import { action } from "@storybook/addon-actions";
import AppBar from "components/AppBar";
import AboutLink from "components/AboutLink";

const DummyAppBar = () => (
  <AppBar brand="DECSYS">
    <AboutLink />
  </AppBar>
);

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
      id: 2,
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
  onNextPage: action("Next Button clicked")
};

export default { title: "Survey/SurveyPage", component: SurveyPage };

export const Basic = () => (
  <SurveyPage
    appBar={<DummyAppBar />}
    page={{ id: 1, components: [] }}
    {...actions}
  />
);

export const withContent = () => (
  <SurveyPage appBar={<DummyAppBar />} page={page} {...actions} />
);
