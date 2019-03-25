import React from "react";
import { storiesOf } from "@storybook/react";
import Ellipse from "./index";

storiesOf("Ellipse", module).add("Default", () => (
  <Ellipse
    barLeftMargin={10}
    barTopMargin={50}
    barRightMargin={10}
    barThickness={8}
  />
));
