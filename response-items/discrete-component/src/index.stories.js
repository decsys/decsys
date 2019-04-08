import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Likert from "./index";

const actions = {
  setNextEnabled: action("Next button toggled"),
  logResults: action("Results logged")
};

storiesOf("Likert", module).add("Default", () => (
  <Likert
    radio1="1"
    radio2="2"
    radio3="3"
    radio1Secondary="Low"
    radio3Secondary="High"
    barLeftMargin={10}
    barTopMargin={50}
    barRightMargin={10}
    barThickness={8}
    {...actions}
  />
));
