import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import { PureNameInput } from "./NameInput";
import { decorate } from "@storybook/addon-actions";

const actions = {
  onChange: decorate([([e]) => [e.target.value, e]]).action("Name changed")
};

storiesOf("Admin/EditorBar/NameInput", module)
  .add("Default", () => <PureNameInput {...actions} />)
  .add("Working", () => (
    <PureNameInput
      name={text("Survey Name", "Untitled Survey")}
      working
      {...actions}
    />
  ))
  .add("Done", () => (
    <PureNameInput
      name={text("Survey Name", "Untitled Survey")}
      done
      {...actions}
    />
  ));
