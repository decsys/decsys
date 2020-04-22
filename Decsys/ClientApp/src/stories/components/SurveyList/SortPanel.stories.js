import React from "react";
import { action } from "@storybook/addon-actions";
import { array } from "@storybook/addon-knobs";
import SortPanel from "components/SurveyList/SortPanel";

export default { title: "Admin/SurveyList/SortPanel", component: SortPanel };

export const Basic = () => (
  <SortPanel
    keys={array("Sort Field Keys", ["Name", "Order"])}
    state={{ key: "name" }}
    onSortButtonClick={action("Sort Button clicked")}
  />
);
