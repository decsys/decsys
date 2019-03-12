import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import MenuItem from "./MenuItem";
import { AngleRight } from "styled-icons/fa-solid";

storiesOf("MenuItem", module)
  .add("Text", () => (
    <MenuItem onClick={action("Button clicked")}>Hello</MenuItem>
  ))
  .add("Icon and Text", () => (
    <MenuItem onClick={action("Button clicked")}>
      <AngleRight size="1em" />
      Hello
    </MenuItem>
  ));
