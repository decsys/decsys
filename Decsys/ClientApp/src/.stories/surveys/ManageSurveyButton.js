import React from "react";
import { storiesOf } from "@storybook/react";
import { ManageSurveyButton } from "../../app/admin/surveys/ManageSurveyButton";
import { BrowserRouter as Router } from "react-router-dom";
import { action } from "@storybook/addon-actions";

const onDuplicateClick = action("ManageSurvey -> Duplicate clicked");
const onDeleteClick = action("ManageSurvey -> Delete modal confirmed");

storiesOf("ManageSurveyButton", module)
  .addDecorator(story => <Router>{story()}</Router>)
  .add("Default", () => (
    <ManageSurveyButton
      onDuplicateClick={onDuplicateClick}
      onDeleteClick={onDeleteClick}
    />
  ))
  .add("with Survey Name", () => (
    <ManageSurveyButton
      name="Hello Survey!"
      onDuplicateClick={onDuplicateClick}
      onDeleteClick={onDeleteClick}
    />
  ))
  .add("with 0 run count", () => (
    <ManageSurveyButton
      name="Hello Survey!"
      runCount={0}
      onDuplicateClick={onDuplicateClick}
      onDeleteClick={onDeleteClick}
    />
  ));
