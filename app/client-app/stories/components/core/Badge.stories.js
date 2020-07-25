import React from "react";
import { ThemeConsumer } from "styled-components";
import { AlignCenter } from "styled-icons/fa-solid";
import { themeVariantsKnob } from "stories/helpers/story-knobs";
import { color } from "@storybook/addon-knobs";
import { Badge } from "components/core";

export default {
  title: "Core UI/Badge",
  component: Badge,
};

export const Basic = () => <Badge />;

export const Colors = () => (
  <Badge backgroundColor={color("Background Color", "#336699")}>Testing</Badge>
);

export const ThemeVariants = () => (
  <ThemeConsumer>
    {(theme) => (
      <Badge backgroundColor={themeVariantsKnob("Variant", theme)}>
        Some content here <AlignCenter size="1em" />
      </Badge>
    )}
  </ThemeConsumer>
);
