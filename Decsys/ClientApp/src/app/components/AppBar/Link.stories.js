import React from "react";
import { storiesOf } from "@storybook/react";
import withNavi from "../../utils/story-navi";
import Link from "./Link";

storiesOf("AppBar/Link", module)
  .addDecorator(withNavi(["/nowhere"]))
  .add("Dark background", () => (
    <Link href="/nowhere" variant="dark">
      Hello
    </Link>
  ))
  .add("Light background", () => (
    <Link href="/nowhere" variant="light">
      Hello
    </Link>
  ));
