import React from "react";
import { Box } from "@smooth-ui/core-sc";

/** A SmoothUI `Box` component already defaulted to `display="flex"` */
const FlexBox = props => (
  <Box display="flex" {...props}>
    {props.children}
  </Box>
);

export default FlexBox;
