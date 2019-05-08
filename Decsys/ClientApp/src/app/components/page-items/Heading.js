import React from "react";
import { Typography } from "@smooth-ui/core-sc";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";

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

PageHeading.params = {
  text: ParamTypes.string("Text"),
  variant: ParamTypes.oneOf(
    "Heading Style",
    ["h1", "h2", "h3", "h4", "h5"],
    "h2"
  ),
  color: ParamTypes.string("Color", "black"),
  textAlign: ParamTypes.oneOf(
    "Alignment",
    ["left", "center", "right"],
    "center"
  ),
  xMargin: ParamTypes.number("Horizontal Margin", 5),
  fontFamily: ParamTypes.stringUndefined("Font Family")
};
const { pt, defaultProps } = buildPropTypes(PageHeading.params);
PageHeading.propTypes = pt;
PageHeading.defaultProps = defaultProps;

export default PageHeading;
