import React, { cloneElement } from "react";
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
    {cloneElement(icon, { size: "1em" })} {name}
  </Typography>
);

export default Component;
