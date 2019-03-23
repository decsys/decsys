import React from "react";
import { storiesOf } from "@storybook/react";
import EditorPageList from "./EditorPageList";
import { action } from "@storybook/addon-actions";

import { pages, actions as pageActions } from "./Page.stories";
import { components } from "./PageComponent.stories";

export const actions = {
  ...pageActions,
  onAddClick: action("Add Page clicked")
};

storiesOf("Admin/EditorPageList", module).add("Default", () => (
  <EditorPageList pages={pages} components={components} actions={actions} />
));
