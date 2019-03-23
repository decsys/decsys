import React from "react";
import { storiesOf } from "@storybook/react";
import { number } from "@storybook/addon-knobs";
import PageHeader from "./PageHeader";

storiesOf("Admin/EditorPageList/PageHeader", module).add("Default", () => (
  <PageHeader n={number("Page Number", 1)} />
));
