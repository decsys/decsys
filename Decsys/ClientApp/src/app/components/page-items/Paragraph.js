import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@smooth-ui/core-sc";
import paramTypes, { buildPropTypes } from "@decsys/param-types";
import ReactMarkdown from "react-markdown";

const PageParagraph = ({ text, ...p }) => (
  <Typography as="div" {...p}>
    <ReactMarkdown source={text} />
  </Typography>
);

PageParagraph.params = {
  color: paramTypes.string("Color", "black"),
  textAlign: paramTypes.oneOf("Alignment", ["left", "center", "right"], "left"),
  fontFamily: paramTypes.stringUndefined("Font Family")
};

const { pt, defaultProps } = buildPropTypes(PageParagraph.params, {
  text: PropTypes.string
});
PageParagraph.propTypes = pt;
PageParagraph.defaultProps = defaultProps;

export default PageParagraph;
