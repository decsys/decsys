import React from "react";
import { storiesOf } from "@storybook/react";
import MenuItem from "../../app/common/MenuItem";
import { AngleRight } from "styled-icons/fa-solid";

storiesOf("MenuItem", module)
  .add("Text", () => <MenuItem>Hello</MenuItem>)
  .add("Icon and Text", () => (
    <MenuItem>
      <AngleRight size="1em" />
      Hello
    </MenuItem>
  ));
