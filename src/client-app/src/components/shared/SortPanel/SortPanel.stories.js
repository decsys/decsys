import React from "react";
import { action } from "@storybook/addon-actions";
import { array } from "@storybook/addon-knobs";
import SortPanel from "components/shared/SortPanel";

export default { title: "Shared/SortPanel", component: SortPanel };

export const Basic = () => (
  <SortPanel
    keys={array("Sort Field Keys", ["Name", "Order"])}
    state={{ key: "name" }}
    onSortButtonClick={action("Sort Button clicked")}
  />
);
