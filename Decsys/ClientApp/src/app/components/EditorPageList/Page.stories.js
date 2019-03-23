import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import Page from "./Page";

import { components } from "./PageComponent.stories";
import { actions as headerActions } from "./PageHeader.stories";

const actions = {
  onComponentSelect: action("Component Selected"),
  onItemDuplicateClick: action("Duplicate Item clicked"),
  onItemDeleteClick: action("Delete Item clicked"),
  ...headerActions
};

storiesOf("Admin/EditorPageList/Page", module)
  .add("Welcome Page", () => (
    <Page
      n={1}
      components={[
        { type: "heading", params: { text: "Welcome" } },
        {
          type: "paragraph",
          params: {
            text: "Here is some information about this Survey"
          }
        }
      ]}
      componentList={components}
      {...actions}
    />
  ))
  .add("Ellipse Page", () => (
    <Page
      n={1}
      components={[
        { type: "heading", params: { text: "Draw a circle" } },
        {
          type: "Ellipse"
        }
      ]}
      componentList={components}
      {...actions}
    />
  ));
