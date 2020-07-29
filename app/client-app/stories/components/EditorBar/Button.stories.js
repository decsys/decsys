import React from "react";
import { Umbrella } from "styled-icons/fa-solid";
import { action } from "@storybook/addon-actions";
import Button from "components/EditorBar/Button";

export default {
  title: "Admin/EditorBar/Button",
  component: Button,
};

export const Basic = () => (
  <Button onClick={action("Button clicked")}>
    <Umbrella size="1em" /> Umbrellas
  </Button>
);
