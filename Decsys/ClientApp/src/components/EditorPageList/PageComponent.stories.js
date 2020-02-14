import React from "react";
import { storiesOf } from "@storybook/react";
import PageComponent from "./PageComponent";
import { action } from "@storybook/addon-actions";
import { AlignLeft, CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";
import { text } from "@storybook/addon-knobs";

export const components = [
  {
    type: "FreeText",
    icon: <AlignLeft />
  },
  {
    type: "Likert",
    icon: <DotCircle />
  },
  {
    type: "Ellipse",
    icon: <CircleNotch />
  }
];

storiesOf("Admin/EditorPageList/PageComponent", module).add("Default", () => (
  <PageComponent
    components={components}
    currentType={text("Current Type", "")}
    onComponentSelect={action("Component Selected")}
  />
));
