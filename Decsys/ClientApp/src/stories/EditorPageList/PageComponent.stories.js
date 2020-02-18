import React from "react";
import PageComponent from "components/EditorPageList/PageComponent";
import { action } from "@storybook/addon-actions";
import { AlignLeft, CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";
import { optionsKnob } from "@storybook/addon-knobs";

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

const typeOptions = () =>
  optionsKnob(
    "Current Type",
    components.reduce((types, { type }) => ({ ...types, [type]: type }), {
      None: ""
    }),
    "",
    { display: "inline-radio" }
  );

export default {
  title: "Admin/EditorPageList/PageComponent",
  component: PageComponent,
  includeStories: /^[A-Z]/
};

export const Basic = () => (
  <PageComponent
    components={components}
    currentType={typeOptions()}
    provided={{}}
    onComponentSelect={action("Component Selected")}
  />
);
