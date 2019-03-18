import React from "react";
import { storiesOf } from "@storybook/react";
import { PureEditorScreen } from "./EditorScreen";

storiesOf("Admin/EditorScreen", module).add("Default", () => (
  <PureEditorScreen survey={{ name: "Hello" }} components={[]} />
));
