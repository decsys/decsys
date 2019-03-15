import React from "react";
import { storiesOf } from "@storybook/react";
import SurveyList from "./SurveyList";
import { withBasicStore } from "../../utils/story-redux";

const state = {
  surveyList: {
    sortState: { key: "name" }
  }
};

storiesOf("Admin/SurveyList", module)
  .addDecorator(withBasicStore(state))
  .add("Default", () => <SurveyList />);
