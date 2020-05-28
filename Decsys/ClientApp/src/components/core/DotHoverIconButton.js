import React, { forwardRef } from "react";
import { BsDot } from "react-icons/bs";
import { Button, PseudoBox, Box } from "@chakra-ui/core";

export const PlaceholderDotButton = p => (
  <Button p={0} variant="ghost" _focus={{}} {...p}>
    <Box as={BsDot} />
  </Button>
);

const DotHoverIconButton = ({ icon, ...p }, ref) => (
  <Button ref={ref} p={0} variant="ghost" _focus={{}} {...p}>
    <PseudoBox display="none" _groupHover={{ display: "inherit" }} as={icon} />
    <PseudoBox _groupHover={{ display: "none" }} as={BsDot} />
  </Button>
);

// we use forwardRef so things that need to target the Button's underlying dom element can
// e.g. tooltips
export default forwardRef(DotHoverIconButton);
