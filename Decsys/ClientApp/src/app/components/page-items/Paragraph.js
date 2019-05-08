import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@smooth-ui/core-sc";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import ReactMarkdown from "react-markdown";

const PageParagraph = ({ text, ...p }) => (
  <Typography as="div" {...p}>
    <ReactMarkdown source={text} />
  </Typography>
);

PageParagraph.params = {
  color: ParamTypes.string("Color", "black"),
  textAlign: ParamTypes.oneOf("Alignment", ["left", "center", "right"], "left"),
  fontFamily: ParamTypes.stringUndefined("Font Family")
};

const { pt, defaultProps } = buildPropTypes(PageParagraph.params, {
  text: PropTypes.string
});
PageParagraph.propTypes = pt;
PageParagraph.defaultProps = defaultProps;

export default PageParagraph;
