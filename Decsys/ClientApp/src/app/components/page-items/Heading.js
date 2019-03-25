import React from "react";
import { Typography } from "@smooth-ui/core-sc";
import paramTypes, { setParams } from "@decsys/param-types";

const PageHeading = ({ text, xMargin, ...p }) => (
  <Typography
    as="div"
    {...p}
    mr={p.textAlign === "right" ? `${xMargin}%` : 0}
    ml={p.textAlign === "left" ? `${xMargin}%` : 0}
  >
    {text}
  </Typography>
);

setParams(PageHeading, {
  text: paramTypes.string("Text"),
  variant: paramTypes.oneOf(
    "Heading Style",
    ["h1", "h2", "h3", "h4", "h5"],
    "h2"
  ),
  color: paramTypes.string("Color", "black"),
  textAlign: paramTypes.oneOf(
    "Alignment",
    ["left", "center", "right"],
    "center"
  ),
  xMargin: paramTypes.number("Horizontal Margin", 5),
  fontFamily: paramTypes.stringUndefined("Font Family")
});

export default PageHeading;
