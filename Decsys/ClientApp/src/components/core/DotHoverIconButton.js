import React, { forwardRef } from "react";
import { BsDot } from "react-icons/bs";
import { Button, PseudoBox } from "@chakra-ui/core";

// we use forwardRef so things that need to target the Button's underlying dom element can
// e.g. tooltips
const DotHoverIconButton = forwardRef(({ icon, ...p }, ref) => (
  <Button ref={ref} p={0} variant="ghost" {...p}>
    <PseudoBox display="none" _groupHover={{ display: "inherit" }} as={icon} />
    <PseudoBox _groupHover={{ display: "none" }} as={BsDot} />
  </Button>
));

export default DotHoverIconButton;
