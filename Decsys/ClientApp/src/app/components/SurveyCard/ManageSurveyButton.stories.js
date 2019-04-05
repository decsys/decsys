import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean } from "@storybook/addon-knobs";
import ManageSurveyButton from "./ManageSurveyButton";
import { action } from "@storybook/addon-actions";
import withNavi from "../../utils/story-navi";
import SurveyCardContext from "./Context";

const context = {
  handleDuplicateClick: action("Duplicate clicked"),
  handleDeleteClick: action("Delete clicked")
};

storiesOf("Admin/SurveyCard/ManageSurveyButton", module)
  .addDecorator(
    withNavi(["/admin/survey/:id/preview", "/admin/survey/:id/export"])
  )
  .addDecorator(s => (
    <SurveyCardContext.Provider value={context}>
      {s()}
    </SurveyCardContext.Provider>
  ))
  .add("Default", () => (
    <ManageSurveyButton
      id={0}
      name={text("Survey name", "My First Survey")}
      editable={boolean("Is Survey Editable", false)}
    />
  ));
