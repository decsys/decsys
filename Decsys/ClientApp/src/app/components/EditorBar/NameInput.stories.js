import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import NameInput from "./NameInput";
import { decorate } from "@storybook/addon-actions";

const actions = {
  onChange: decorate([([e]) => [e.target.value, e]]).action("Name changed")
};

const knobs = {
  name: text("Survey Name", "Untitled Survey")
};

storiesOf("Admin/EditorBar/NameInput", module)
  .add("Default", () => <NameInput {...actions} />)
  .add("Saving", () => <NameInput {...knobs} {...actions} saving />)
  .add("Saved", () => <NameInput {...knobs} {...actions} saved />);
