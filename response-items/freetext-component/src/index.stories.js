import React from "react";
import { storiesOf } from "@storybook/react";
import {text} from "@storybook/addon-knobs"
import FreeText from "./index";


storiesOf("FreeText", module).add("Default", () => <FreeText initialText={text("Text", "Hello")} /> );