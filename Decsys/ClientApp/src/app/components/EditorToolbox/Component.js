import React from "react";
import { Typography } from "@smooth-ui/core-sc";

// TODO: PropTypes

const Component = ({ name, icon }) => (
  <Typography
    py={1}
    px={2}
    border={1}
    borderColor="cardBorder"
    backgroundColor="cardBg"
  >
    {icon} {name}
  </Typography>
);

export default Component;
