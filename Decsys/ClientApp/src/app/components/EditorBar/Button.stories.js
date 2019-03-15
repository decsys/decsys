import React from "react";
import { storiesOf } from "@storybook/react";
import { Umbrella } from "styled-icons/fa-solid";
import { action } from "@storybook/addon-actions";
import Button from "./Button";

storiesOf("Admin/EditorBar/Button", module).add("Default", () => (
  <Button onClick={action("Button clicked")}>
    <Umbrella size="1em" /> Umbrellas
  </Button>
));
