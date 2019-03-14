import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { ManageSurveyButton } from "./ManageSurveyButton";
import { action } from "@storybook/addon-actions";

storiesOf("Admin/SurveyCard/ManageSurveyButton", module)
  .addDecorator(StoryRouter())
  .add("Default", () => (
    <ManageSurveyButton
      id={0}
      name={text("Survey name", "My First Survey")}
      editable={boolean("Is Survey Editable", false)}
      onDuplicateClick={action("Duplicate clicked")}
      onDeleteClick={action("Delete confirmed")}
    />
  ));
