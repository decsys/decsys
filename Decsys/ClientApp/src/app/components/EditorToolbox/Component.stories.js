import React from "react";
import { storiesOf } from "@storybook/react";
import { Box } from "@smooth-ui/core-sc";
import { Umbrella } from "styled-icons/fa-solid";
import Component from "./Component";

storiesOf("Admin/EditorToolbox/Component", module)
  .addDecorator(story => <Box my={1}>{story()}</Box>) // fix padding in storybook
  .add("Default", () => (
    <Component icon={<Umbrella size="1em" />} name="Umbrella" />
  ));
