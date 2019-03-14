import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { object, array } from "@storybook/addon-knobs";
import SortPanel from "./SortPanel";

storiesOf("Admin/SurveyList/SortPanel", module).add("Default", () => (
  <SortPanel
    keys={array("Sort Field Keys", ["Name", "Order"])}
    sortState={object("Sort State", { key: "name" })}
    onSortButtonClick={key => action(`Sort button '${key}' clicked`)}
  />
));
