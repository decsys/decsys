// TODO: params fix
// import React from "react";
// import { text, number, optionsKnob } from "@storybook/addon-knobs";
// import { Heading } from "components/page-items";

// // Actually load the params as knobs
// const getLabel = (param) => Heading.params[param].label;
// const getDefault = (param) => Heading.params[param].defaultValue;
// const getEnum = (param) => Heading.params[param].oneOf;

// const options = { display: "inline-radio" };

// export default {
//   title: "Page Content Items/Heading",
//   component: Heading,
// };

// export const Basic = () => (
//   <Heading
//     text={text(getLabel("text"), getDefault("text"))}
//     xMargin={number(getLabel("xMargin"), getDefault("xMargin"))}
//     color={text(getLabel("color"), getDefault("color"))}
//     variant={optionsKnob(
//       getLabel("variant"),
//       getEnum("variant"),
//       getDefault("variant"),
//       options
//     )}
//     textAlign={optionsKnob(
//       getLabel("textAlign"),
//       getEnum("textAlign"),
//       getDefault("textAlign"),
//       options
//     )}
//     fontFamily={text(getLabel("fontFamily"), undefined)}
//   />
// );
