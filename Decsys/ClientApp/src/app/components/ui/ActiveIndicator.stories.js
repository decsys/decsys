import React from "react";
import { storiesOf } from "@storybook/react";
import ActiveIndicator from "./ActiveIndicator";

storiesOf("ActiveIndicator", module)
  .add("Default (inactive)", () => <ActiveIndicator />)
  .add("Active", () => <ActiveIndicator active />);
