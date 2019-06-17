import React from "react";
import { storiesOf } from "@storybook/react";
import withNavi from "../../utils/story-navi";
import AboutLink from "./AboutLink";

storiesOf("AboutLink", module)
  .addDecorator(withNavi(["/nowhere"]))
  .add("Default", () => <AboutLink />);
