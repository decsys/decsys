import React from "react";
import { action } from "@storybook/addon-actions";
import { boolean, text } from "@storybook/addon-knobs";
import SortButton from "components/SurveyList/SortButton";

export default { title: "Admin/SurveyList/SortButton", component: SortButton };

export const Basic = () => (
  <SortButton
    active={boolean("Active Sort Field", false)}
    asc={boolean("Ascending", false)}
    onClick={action("SortButton clicked")}
  >
    {text("Sort Field label", "Name")}
  </SortButton>
);
