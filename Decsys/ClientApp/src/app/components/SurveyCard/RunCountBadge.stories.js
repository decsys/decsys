import React from "react";
import { storiesOf } from "@storybook/react";
import { number, optionsKnob } from "@storybook/addon-knobs";
import RunCountBadge from "./RunCountBadge";
import theme from "../../themes";

storiesOf("Admin/SurveyCard/RunCountBadge", module)
  .add("Default", () => <RunCountBadge />)
  .add("n runs", () => <RunCountBadge count={number("count", 5)} />);
