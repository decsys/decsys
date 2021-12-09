import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import { Box } from "@chakra-ui/react";

const PageVerticalSpacer = ({ height }) => {
  return <Box minHeight={`${height}px`} />;
};

PageVerticalSpacer.params = {
  height: ParamTypes.number("Height (px)", 50),
  questionContent:ParamTypes.string("Quesion Content"),
};
const { pt, defaultProps } = buildPropTypes(PageVerticalSpacer.params);
PageVerticalSpacer.propTypes = pt;
PageVerticalSpacer.defaultProps = defaultProps;
PageVerticalSpacer.questionContent = "questionContent"

export default PageVerticalSpacer;
