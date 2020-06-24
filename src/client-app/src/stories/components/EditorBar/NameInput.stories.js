import React from "react";
import { text } from "@storybook/addon-knobs";
import NameInput from "components/EditorBar/NameInput";
import { decorate } from "@storybook/addon-actions";

const actions = {
  onChange: decorate([([e]) => [e.target.value, e]]).action("Name changed")
};

const knobs = {
  name: text("Survey Name", "Untitled Survey")
};

export default {
  title: "Admin/EditorBar/NameInput",
  component: NameInput
};

export const Basic = () => <NameInput {...knobs} {...actions} />;

export const Saving = () => <NameInput {...knobs} {...actions} saving />;

export const Saved = () => <NameInput {...knobs} {...actions} saved />;
