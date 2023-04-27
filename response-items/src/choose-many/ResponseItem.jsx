import { createElement } from "react";
import { params } from "./ResponseItem.params";
import { filterOptions } from "../Choose-one/utils/option-params";
import { Flex } from "@chakra-ui/react";
import CheckboxList from "./components/CheckboxList";

const ResponseItem = ({
  _context: { logResults, setIsValidResponse },
  confirmed: initialChecked,
  alignment,
  textColor,
  fontSize,
  fontFamily,
  colorScheme,
  minChecks,
  maxChecks,
  ...props
}) => {
  const options = filterOptions(props);

  const align =
    { left: "flex-start", right: "flex-end" }[alignment] ?? "center";

  const styles = {
    textColor,
    fontSize,
    fontFamily,
    colorScheme,
  };

  return (
    <Flex w="100%" justify={align}>
      {createElement(CheckboxList, {
        confirmed: initialChecked,
        minChecks,
        maxChecks,
        options,
        logResults,
        setIsValidResponse,
        ...styles,
      })}
    </Flex>
  );
};

ResponseItem.params = params;

export default ResponseItem;
