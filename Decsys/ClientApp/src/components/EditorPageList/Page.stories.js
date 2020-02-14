import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import Page from "./Page";

import { components } from "./PageComponent.stories";
import { actions as headerActions } from "./PageHeader.stories";

export const actions = {
  onComponentSelect: action("Component Selected"),
  itemActions: {
    onDuplicateClick: action("Duplicate Item clicked"),
    onDeleteClick: action("Delete Item clicked")
  },
  pageActions: headerActions
};

export const pages = [
  {
    id: "1",
    order: 1,
    components: [
      { id: "1", order: 1, type: "heading", params: { text: "Welcome" } },
      {
        id: "2",
        order: 2,
        type: "paragraph",
        params: {
          text: "Here is some information about this Survey"
        }
      }
    ]
  },
  {
    id: "2",
    order: 2,
    components: [
      { id: "3", order: 2, type: "heading", params: { text: "Draw a circle" } },
      {
        id: "4",
        order: 1,
        type: "Ellipse",
        params: {}
      }
    ]
  }
];

storiesOf("Admin/EditorPageList/Page", module)
  .add("Welcome Page", () => (
    <Page n={1} page={pages[0]} componentList={components} {...actions} />
  ))
  .add("Ellipse Page", () => (
    <Page n={2} page={pages[1]} componentList={components} {...actions} />
  ));
