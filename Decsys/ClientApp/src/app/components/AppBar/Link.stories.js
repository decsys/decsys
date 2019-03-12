import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import Link from "./Link";

storiesOf("AppBarLink", module)
  .addDecorator(StoryRouter())
  .add("default", () => <Link to="/nowhere">Hello</Link>);
