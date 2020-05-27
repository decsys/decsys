import React, { forwardRef } from "react";
import { BsDot } from "react-icons/bs";
import { Button, PseudoBox } from "@chakra-ui/core";

const DotHoverIconButton = ({ icon, ...p }, ref) => (
  <Button ref={ref} p={0} variant="ghost" {...p}>
    <PseudoBox display="none" _groupHover={{ display: "inherit" }} as={icon} />
    <PseudoBox _groupHover={{ display: "none" }} as={BsDot} />
  </Button>
);

// we use forwardRef so things that need to target the Button's underlying dom element can
// e.g. tooltips
export default forwardRef(DotHoverIconButton);
