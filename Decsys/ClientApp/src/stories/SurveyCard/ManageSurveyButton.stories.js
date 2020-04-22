import React from "react";
import { text, boolean } from "@storybook/addon-knobs";
import ManageSurveyButton from "components/SurveyCard/ManageSurveyButton";
import { action } from "@storybook/addon-actions";
import withNavi from "stories/helpers/story-navi";
import SurveyCardContext from "components/SurveyCard/Context";
import { context as configModalContext } from "./SurveyConfigModal.stories";

export const basePath = "/admin/survey/:id";
export const naviPaths = [`${basePath}/preview`, `${basePath}/export`];

export const context = {
  ...configModalContext,
  handleEditClick: action("Edit clicked"),
  handleDuplicateClick: action("Duplicate clicked"),
  handleDeleteClick: action("Delete clicked")
};

export default {
  title: "Admin/SurveyCard/ManageSurveyButton",
  component: ManageSurveyButton,
  decorators: [
    withNavi([naviPaths]),
    s => (
      <SurveyCardContext.Provider value={context}>
        {s()}
      </SurveyCardContext.Provider>
    )
  ],
  includeStories: /^[A-Z]/
};

export const Basic = () => (
  <ManageSurveyButton
    id={0}
    name={text("Survey name", "My First Survey")}
    editable={boolean("Is Survey Editable", false)}
  />
);
