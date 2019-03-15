import React from "react";
import { storiesOf } from "@storybook/react";
import { PureSurveyList } from "./SurveyList";
import { withBasicStore } from "../../utils/story-redux";
import { decorate, action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";

const s = id => ({ id, name: "" });
const sorted = [s(1), s(3), s(2)];

const p = {
  sortState: { key: "name" },
  surveys: {
    1: { id: 1, name: "A Survey 1", active: false, runCount: 7 },
    2: { id: 2, name: "C Survey 2", active: false, runCount: 0 },
    3: { id: 3, name: "B Survey 3", active: true, runCount: 1 }
  },
  sorted,
  filtered: sorted
};

storiesOf("Admin/SurveyList", module)
  .addDecorator(StoryRouter())
  .addDecorator(withBasicStore())
  .add("Default", () => (
    <PureSurveyList
      sortState={p.sortState}
      onEmptyActionClick={action("Create clicked")}
      onFilterChange={() => 0}
    />
  ))
  .add("Surveys", () => (
    <PureSurveyList
      {...p}
      onEmptyActionClick={() => 0}
      onFilterChange={decorate([([e]) => [e.target.value, e]]).action(
        "Filter changed"
      )}
    />
  ));
