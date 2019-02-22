import React from "react";
import { storiesOf } from "@storybook/react";
import RunCountBadge from "../../app/admin/surveys/RunCountBadge";

storiesOf("RunCountBadge", module)
  .add("Default", () => <RunCountBadge />)
  .add("1 digit", () => <RunCountBadge count={5} />)
  .add("4 digits", () => <RunCountBadge count={5000} />);
