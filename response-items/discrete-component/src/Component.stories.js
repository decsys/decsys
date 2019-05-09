import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Component from "./Component";

const actions = {
  setNextEnabled: action("Next button toggled"),
  logResults: action("Results logged")
};

storiesOf("Component", module).add("Default", () => (
  <Component
    radio1="1"
    radio2="2"
    radio3="3"
    radio4="4"
    radio5="5"
    radio6="6"
    radio7="7"
    radio8="I'm not used"
    radio1Secondary="Low"
    radio7Secondary="High"
    barLeftMargin={10}
    barTopMargin={50}
    barRightMargin={10}
    barThickness={8}
    {...actions}
  />
));
