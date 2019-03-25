import React from "react";
import { storiesOf } from "@storybook/react";
import Likert from "./index";

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
  />
));
