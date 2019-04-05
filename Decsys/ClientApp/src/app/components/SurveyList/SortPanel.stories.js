import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { array } from "@storybook/addon-knobs";
import SurveyListContext from "./SurveyListContext";
import SortPanel from "./SortPanel";

const context = {
  sortSurveyList: (key, asc) =>
    action(`Sorting Surveys by '${key}' ${asc ? "ascending" : "descending"}`)({
      key,
      asc
    })
};

storiesOf("Admin/SurveyList/SortPanel", module)
  .addDecorator(s => (
    <SurveyListContext.Provider value={context}>
      {s()}
    </SurveyListContext.Provider>
  ))
  .add("Default", () => (
    <SortPanel keys={array("Sort Field Keys", ["Name", "Order"])} />
  ));
