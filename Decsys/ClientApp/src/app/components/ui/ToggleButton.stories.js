import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ToggleButton from "./ToggleButton";

storiesOf("Common UI/ToggleButton", module).add("Default", () => (
  <ToggleButton onClick={action("toggled!")}>Hello!</ToggleButton>
));
