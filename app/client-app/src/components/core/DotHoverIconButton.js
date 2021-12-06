import { forwardRef } from "react";
import { BsDot } from "react-icons/bs";
import { Button, Box, Tooltip } from "@chakra-ui/react";

const DotHoverIconButton = ({ icon, disableHover,tooltip, ...p }, ref) => {
  const show = { display: "inherit" };
  const hide = { display: "none" };
  return (
    <Tooltip label={tooltip}>
      <Button ref={ref} p={0} variant="ghost" _focus={false} {...p}>
        <Box {...hide} _groupHover={!disableHover && show} as={icon} />
        <Box _groupHover={!disableHover && hide} as={BsDot} />
      </Button>
    </Tooltip>
  );
};

// we use forwardRef so things that need to target the Button's underlying dom element can
// e.g. tooltips
export default forwardRef(DotHoverIconButton);
