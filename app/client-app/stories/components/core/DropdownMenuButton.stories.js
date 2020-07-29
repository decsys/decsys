import React from "react";
import { action } from "@storybook/addon-actions";
import { AngleRight } from "styled-icons/fa-solid";
import { DropdownMenuButton, MenuItem } from "components/core";

export default {
  title: "Core UI/DropdownMenuButton",
  component: DropdownMenuButton,
};

export const Basic = () => (
  <DropdownMenuButton>
    <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
    <MenuItem onClick={action("Goodbye clicked")}>
      <AngleRight size="1em" />
      Goodbye
    </MenuItem>
  </DropdownMenuButton>
);
