import React from "react";
import EditorPageList from "components/EditorPageList";
import { action } from "@storybook/addon-actions";

import { pages, actions as pageActions } from "./Page.stories";
import { components } from "./PageComponent.stories";

export const actions = {
  ...pageActions,
  onAddClick: action("Add Page clicked"),
};

export default {
  title: "Admin/EditorPageList",
  component: EditorPageList,
  includeStories: /^[A-Z]/,
};

export const Basic = () => (
  <EditorPageList pages={pages} components={components} actions={actions} />
);
