import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { boolean, text } from "@storybook/addon-knobs";
import SortButton from "./SortButton";

storiesOf("Admin/SurveyList/SortButton", module).add("Default", () => (
  <SortButton
    active={boolean("Active Sort Field", false)}
    asc={boolean("Ascending", false)}
    onClick={action("SortButton clicked")}
  >
    {text("Sort Field label", "Name")}
  </SortButton>
));
