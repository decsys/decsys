import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SortButtonsPanel from "../../app/admin/surveys/SortButtonsPanel";

storiesOf("SortButtonsPanel", module)
  .add("Default", <SortButtonsPanel />)
  .add("With buttons", <SortButtonsPanel keys={["Name", "Id"]} />);
