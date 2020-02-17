import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { AngleRight } from "styled-icons/fa-solid";
import { DropdownMenuButton, MenuItem } from "components/core";

storiesOf("Common UI/DropdownMenuButton", module).add("Default", () => (
  <DropdownMenuButton>
    <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
    <MenuItem onClick={action("Goodbye clicked")}>
      <AngleRight size="1em" />
      Goodbye
    </MenuItem>
  </DropdownMenuButton>
));
