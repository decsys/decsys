import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean } from "@storybook/addon-knobs";
import Confirm from "./index";

storiesOf("Confirm", module).add("Default", () => (
  <Confirm
    label={text(Confirm.params.label.label, Confirm.params.label.defaultValue)}
    initialChecked={boolean("Initially Checked", false)}
  />
));
