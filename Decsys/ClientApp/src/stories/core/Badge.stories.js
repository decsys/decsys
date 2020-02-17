import React from "react";
import { withTheme } from "styled-components";
import { storiesOf } from "@storybook/react";
import { AlignCenter } from "styled-icons/fa-solid";
import { colorsKnob } from "stories/util/story-knobs";
import { Badge } from "components/core";

//have to define this one separately to get the current theme
const ThemedBadge = withTheme(props => (
  <Badge backgroundColor={colorsKnob("Background Color", props.theme)}>
    Some content here <AlignCenter size="1em" />
  </Badge>
));

storiesOf("Common UI/Badge", module)
  .add("Default", () => <Badge />)
  .add("Variants", () => <ThemedBadge />);
