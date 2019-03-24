import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@smooth-ui/core-sc";
import paramTypes, { setParams } from "../../../param-types";
import ReactMarkdown from "react-markdown";

const PageParagraph = ({ text, ...p }) => (
  <Typography as="div" {...p}>
    <ReactMarkdown source={text} />
  </Typography>
);

PageParagraph.propTypes = {
  text: PropTypes.string
};

setParams(PageParagraph, {
  color: paramTypes.string("Color", "black"),
  textAlign: paramTypes.oneOf("Alignment", ["left", "center", "right"], "left"),
  fontFamily: paramTypes.stringUndefined("Font Family")
});

export default PageParagraph;
