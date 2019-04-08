import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Ellipse from "./index";

const actions = {
  setNextEnabled: action("Next button toggled"),
  logResults: action("Results logged")
};

storiesOf("Ellipse", module).add("Default", () => (
  <Ellipse
    barLeftMargin={10}
    barTopMargin={50}
    barRightMargin={10}
    barThickness={8}
    barMaxValue={100}
    barMinValue={0}
    {...actions}
  />
));
