import React from "react";
import { storiesOf } from "@storybook/react";
import { CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";
import EditorToolbox from "./EditorToolbox";

const components = [
  { icon: <CircleNotch size="1em" />, type: "Ellipse" },
  { icon: <DotCircle size="1em" />, type: "Likert" }
];

storiesOf("Admin/EditorToolbox", module).add("Default", () => (
  <EditorToolbox components={components} />
));
