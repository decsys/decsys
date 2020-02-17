import React from "react";
import { storiesOf } from "@storybook/react";
import { LoadingIndicator } from "components/core";

storiesOf("Common UI/LoadingIndicator", module).add("Default", () => (
  <LoadingIndicator />
));
