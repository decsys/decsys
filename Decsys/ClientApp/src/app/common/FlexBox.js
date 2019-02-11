import React from "react";
import { Box } from "@smooth-ui/core-sc";

const FlexBox = props => (
  <Box display="flex" {...props}>
    {props.children}
  </Box>
);

export default FlexBox;
