import React from "react";
import { action } from "@storybook/addon-actions";
import { DragDropContext } from "react-beautiful-dnd";
import Page from "components/EditorPageList/Page";

import { components } from "./PageComponent.stories";
import { actions as headerActions } from "./PageHeader.stories";

export const actions = {
  onComponentSelect: action("Component Selected"),
  itemActions: {
    onDuplicateClick: action("Duplicate Item clicked"),
    onDeleteClick: action("Delete Item clicked"),
  },
  pageActions: headerActions,
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
          text: "Here is some information about this Survey",
        },
      },
    ],
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
        params: {},
      },
    ],
  },
];

export default {
  title: "Admin/EditorPageList/Page",
  component: Page,
  includeStories: /Page$/,
  decorators: [
    (s) => <DragDropContext onDragEnd={() => {}}>{s()}</DragDropContext>,
  ],
};

export const WelcomePage = () => (
  <Page
    n={1}
    page={pages[0]}
    pageListProvided={{}}
    componentList={components}
    {...actions}
  />
);

export const EllipsePage = () => (
  <Page
    n={2}
    page={pages[1]}
    pageListProvided={{}}
    componentList={components}
    {...actions}
  />
);
