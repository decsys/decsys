import { configure, addDecorator } from "@storybook/react";
import { withThemes } from "storybook-styled-components";
import theme from "../src/themes";

addDecorator(withThemes({ Default: theme }));

configure(() => require("../src/stories"), module);
