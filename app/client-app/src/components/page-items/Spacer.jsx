import ParamTypes from "@decsys/param-types";
import { Box } from "@chakra-ui/react";

const PageVerticalSpacer = ({ height }) => {
  return <Box minHeight={`${height}px`} />;
};

PageVerticalSpacer.params = {
  height: ParamTypes.number("Height (px)", 50),
  questionContent: ParamTypes.string("Question Content"),
};

export default PageVerticalSpacer;
