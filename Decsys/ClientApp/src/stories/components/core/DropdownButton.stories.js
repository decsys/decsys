import React from "react";
import { action } from "@storybook/addon-actions";
import { AngleRight, EllipsisV } from "styled-icons/fa-solid";
import { DropdownButton } from "components/core";

export default {
  title: "Core UI/DropdownButton",
  component: DropdownButton
};

export const Basic = () => (
  <DropdownButton onClick={action("Button clicked")} />
);

export const WithText = () => (
  <DropdownButton button="Click me" onClick={action("Button clicked")} />
);

export const WithIconAndText = () => (
  <DropdownButton
    button={
      <>
        <AngleRight size="1em" />
        Hello
      </>
    }
    onClick={action("Button clicked")}
  />
);

export const WithoutCaret = () => (
  <DropdownButton
    button={<EllipsisV size="1em" />}
    caret={false}
    onClick={action("Button clicked")}
  />
);

export const PassOnButtonProps = () => (
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
);

export const WithTooltip = () => (
  <DropdownButton
    tooltip={{
      placement: "right",
      content: (
        <>
          <EllipsisV size="1em" />
          Hello there
        </>
      )
    }}
    onClick={action("Button clicked")}
  />
);
