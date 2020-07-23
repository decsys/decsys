import React from "react";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import LightHeading from "components/core/LightHeading";

const PageHeading = ({ text, xMargin, color, variant, ...p }) => {
  const size = { h1: "2xl", h2: "xl", h3: "lg", h4: "md", h5: "sm" }[variant];

  return (
    // we set color in standard CSS,
    // so that simple CSS color names work e.g. "red"
    // and we don't have to explain to users how chakra theme colors work e.g. "red.500"
    <LightHeading
      as={variant}
      size={size}
      {...p}
      mr={p.textAlign === "right" ? `${xMargin}%` : 0}
      ml={p.textAlign === "left" ? `${xMargin}%` : 0}
      style={{ color }}
    >
      {text}
    </LightHeading>
  );
};

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
  fontFamily: ParamTypes.stringUndefined("Font Family"),
};
const { pt, defaultProps } = buildPropTypes(PageHeading.params);
PageHeading.propTypes = pt;
PageHeading.defaultProps = defaultProps;

export default PageHeading;
