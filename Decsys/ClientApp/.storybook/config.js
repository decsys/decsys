import { configure, addDecorator } from "@storybook/react";
import { withThemes } from "storybook-styled-components";
import theme from "../src/themes";

function loadStories() {
  require("../src/stories");
}

addDecorator(
  withThemes({
    Default: theme
  })
);

configure(loadStories, module);
