import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import DropdownButton from "./DropdownButton";
import { AngleRight, EllipsisV } from "styled-icons/fa-solid";

storiesOf("Common UI/DropdownButton", module)
  .add("Default", () => <DropdownButton onClick={action("Button clicked")} />)
  .add("Text", () => (
    <DropdownButton button="Click me" onClick={action("Button clicked")} />
  ))
  .add("Icon and Text", () => (
    <DropdownButton
      button={
        <>
          <AngleRight size="1em" />
          Hello
        </>
      }
      onClick={action("Button clicked")}
    />
  ))
  .add("Without caret", () => (
    <DropdownButton
      button={<EllipsisV size="1em" />}
      caret={false}
      onClick={action("Button clicked")}
    />
  ))
  .add("Pass on Button props", () => (
    <DropdownButton
      variant="success"
      p={4}
      display="inline-flex"
      justifyContent="center"
      borderRadius={100}
      button={<EllipsisV size="1em" />}
      caret={false}
      onClick={action("Button clicked")}
    />
  ));
