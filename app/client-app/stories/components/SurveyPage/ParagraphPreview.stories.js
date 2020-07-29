import React from "react";
import ParagraphPreview from "components/SurveyPage/ParagraphPreview";
import PageParagraph from "components/page-items/Paragraph";

export default {
  title: "Admin/ComponentEditor/ParagraphPreview",
  component: ParagraphPreview,
};

export const Basic = () => (
  <ParagraphPreview
    component={PageParagraph}
    params={{
      text: "# I'm a heading \n and here's *some* **other** __text__.",
      alignText: "right",
    }}
  />
);
