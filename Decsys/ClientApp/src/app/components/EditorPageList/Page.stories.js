import React from "react";
import { storiesOf } from "@storybook/react";
import Page from "./Page";

import { components } from "./PageComponent.stories";
import { CircleNotch } from "styled-icons/fa-solid";

storiesOf("Admin/EditorPageList/Page", module)
  .add("Welcome Page", () => (
    <Page
      n={1}
      components={[
        { type: "heading", text: "Welcome" },
        {
          type: "paragraph",
          text: "Here is some information about this Survey"
        }
      ]}
      componentList={components}
    />
  ))
  .add("Ellipse Page", () => (
    <Page
      n={1}
      components={[
        { type: "heading", text: "Draw a circle" },
        {
          type: "Ellipse",
          icon: <CircleNotch />
        }
      ]}
      componentList={components}
    />
  ));
