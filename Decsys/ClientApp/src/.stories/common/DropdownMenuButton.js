import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import DropdownMenuButton from "../../app/common/DropdownMenuButton";
import MenuItem from "../../app/common/MenuItem";
import { AngleRight, EllipsisV } from "styled-icons/fa-solid";

const items = (
  <>
    <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
    <MenuItem onClick={action("Goodbye clicked")}>
      <AngleRight size="1em" />
      Goodbye
    </MenuItem>
  </>
);

storiesOf("DropdownMenuButton", module)
  .add("Default", () => <DropdownMenuButton>{items}</DropdownMenuButton>)
  .add("Text", () => (
    <DropdownMenuButton button="Hello">{items}</DropdownMenuButton>
  ))
  .add("Icon and Text", () => (
    <DropdownMenuButton
      button={
        <>
          <AngleRight size="1em" />
          Hello
        </>
      }
    >
      {items}
    </DropdownMenuButton>
  ))
  .add("Without caret", () => (
    <DropdownMenuButton button={<EllipsisV size="1em" />} caret={false}>
      {items}
    </DropdownMenuButton>
  ))
  .add("Pass on Button props", () => (
    <DropdownMenuButton
      variant="success"
      p={4}
      display="inline-flex"
      justifyContent="center"
      borderRadius={100}
      button={<EllipsisV size="1em" />}
      caret={false}
    >
      {items}
    </DropdownMenuButton>
  ));
