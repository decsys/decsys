import React from "react";
import { Button as SmoothButton } from "@smooth-ui/core-sc";

const Button = props => (
  <SmoothButton borderRadius={0} width="120px" variant="secondary" {...props} />
);

export default Button;
