import React from "react";
import { storiesOf } from "@storybook/react";
import { number } from "@storybook/addon-knobs";
import RunCountBadge from "./RunCountBadge";

storiesOf("Admin/SurveyCard/RunCountBadge", module)
  .add("Default", () => <RunCountBadge />)
  .add("n runs", () => <RunCountBadge count={number("count", 5)} />);
