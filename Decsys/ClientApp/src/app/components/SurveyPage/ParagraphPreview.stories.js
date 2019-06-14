import React from "react";
import { storiesOf } from "@storybook/react";
import ParagraphPreview from "./ParagraphPreview";
import PageParagraph from "../page-items/Paragraph";

storiesOf("Admin/ComponentEditor/ParagraphPreview", module).add(
  "Default",
  () => (
    <ParagraphPreview
      component={PageParagraph}
      params={{
        text: "# I'm a heading \n and here's *some* **other** __text__.",
        alignText: "right"
      }}
    />
  )
);
