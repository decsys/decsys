import React from "react";
import { storiesOf } from "@storybook/react";
import DropdownMenuButton from "../../app/common/DropdownMenuButton";
import MenuItem from "../../app/common/MenuItem";
import { AngleRight, EllipsisV } from "styled-icons/fa-solid";

storiesOf("DropdownMenuButton", module)
  .add("Text", () => (
    <DropdownMenuButton button="Hello">
      <MenuItem>Hello</MenuItem>
      <MenuItem>
        <AngleRight size="1em" />
        Goodbye
      </MenuItem>
    </DropdownMenuButton>
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
      <MenuItem>Hello</MenuItem>
      <MenuItem>
        <AngleRight size="1em" />
        Goodbye
      </MenuItem>
    </DropdownMenuButton>
  ))
  .add("Without caret", () => (
    <DropdownMenuButton button={<EllipsisV size="1em" />} caret={false}>
      <MenuItem>Hello</MenuItem>
      <MenuItem>
        <AngleRight size="1em" />
        Goodbye
      </MenuItem>
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
      <MenuItem>Hello</MenuItem>
      <MenuItem>
        <AngleRight size="1em" />
        Goodbye
      </MenuItem>
    </DropdownMenuButton>
  ));
