import React from "react";
import { action } from "@storybook/addon-actions";
import ToggleButton from "components/ui/ToggleButton";

export default { title: "Core UI/ToggleButton" };

export const withText = () => (
  <ToggleButton onClick={action("toggled!")}>Hello</ToggleButton>
);
