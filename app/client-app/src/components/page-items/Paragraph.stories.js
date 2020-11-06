// TODO: params fix
// import React from "react";
// import { text, optionsKnob } from "@storybook/addon-knobs";
// import { Paragraph } from "components/page-items";

// const getLabel = (param) => Paragraph.params[param].label;
// const getDefault = (param) => Paragraph.params[param].defaultValue;
// const getEnum = (param) => Paragraph.params[param].oneOf;

// const options = { display: "inline-radio" };

// export default {
//   title: "Page Content Items/Paragraph",
//   component: Paragraph,
// };

// export const Basic = () => (
//   <Paragraph
//     text={text(
//       "Markdown",
//       `# Hello

// here's *some* **text**`
//     )}
//     color={text(getLabel("color"), getDefault("color"))}
//     textAlign={optionsKnob(
//       getLabel("textAlign"),
//       getEnum("textAlign"),
//       getDefault("textAlign"),
//       options
//     )}
//     fontFamily={text(getLabel("fontFamily"), undefined)}
//   />
// );
