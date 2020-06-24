import React, { forwardRef } from "react";
import { BsDot } from "react-icons/bs";
import { Button, PseudoBox } from "@chakra-ui/core";

const DotHoverIconButton = ({ icon, disableHover, ...p }, ref) => {
  const show = { display: "inherit" };
  const hide = { display: "none" };
  return (
    <Button ref={ref} p={0} variant="ghost" _focus={false} {...p}>
      <PseudoBox {...hide} _groupHover={!disableHover && show} as={icon} />
      <PseudoBox _groupHover={!disableHover && hide} as={BsDot} />
    </Button>
  );
};

// we use forwardRef so things that need to target the Button's underlying dom element can
// e.g. tooltips
export default forwardRef(DotHoverIconButton);
