import React from "react";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import { Box } from "@chakra-ui/core";

const Spacer = ({ height }) => {
  return <Box minHeight={`${height}px`} />;
};

Spacer.params = {
  height: ParamTypes.number("Height (px)", 50),
};
const { pt, defaultProps } = buildPropTypes(Spacer.params);
Spacer.propTypes = pt;
Spacer.defaultProps = defaultProps;

export default Spacer;
