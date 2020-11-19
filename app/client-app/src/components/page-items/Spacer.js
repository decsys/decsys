import React from "react";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import { Box } from "@chakra-ui/react";

const PageVerticalSpacer = ({ height }) => {
  return <Box minHeight={`${height}px`} />;
};

PageVerticalSpacer.params = {
  height: ParamTypes.number("Height (px)", 50),
};
const { pt, defaultProps } = buildPropTypes(PageVerticalSpacer.params);
PageVerticalSpacer.propTypes = pt;
PageVerticalSpacer.defaultProps = defaultProps;

export default PageVerticalSpacer;
