import React from "react";
import { Box } from "@smooth-ui/core-sc";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";

const Spacer = ({ height }) => {
  return <Box minHeight={`${height}px`} />;
};

Spacer.params = {
  height: ParamTypes.number("Height (px)", 50)
};
const { pt, defaultProps } = buildPropTypes(Spacer.params);
Spacer.propTypes = pt;
Spacer.defaultProps = defaultProps;

export default Spacer;
