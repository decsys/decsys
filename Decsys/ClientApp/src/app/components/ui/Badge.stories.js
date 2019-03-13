import React from "react";
import { storiesOf } from "@storybook/react";
import { optionsKnob } from "@storybook/addon-knobs";
import theme from "../../themes";
import Badge from "./Badge";
import { AlignCenter } from "styled-icons/fa-solid";

storiesOf("Badge", module)
  .add("Default", () => <Badge />)
  .add("Variants", () => (
    <Badge
      backgroundColor={optionsKnob(
        "Background Color",
        Object.keys(theme.colors).reduce((a, v) => {
          a[v] = v;
          return a;
        }, {}),
        "info",
        { display: "inline-radio" }
      )}
    >
      Some content here <AlignCenter size="1em" />
    </Badge>
  ));
