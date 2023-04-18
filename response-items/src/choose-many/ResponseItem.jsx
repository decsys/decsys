import { useEffect, useState, createElement, useRef } from "react";
import { params } from "./ResponseItem.params";
import { filterOptions } from "../Choose-one/utils/option-params";
import { Flex, Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import CheckboxList from "./components/CheckboxList";

const ResponseItem = ({
  confirmed: initialChecked,
  _context: { setIsValidResponse, logResults },
  alignment,
  textColor,
  fontSize,
  fontFamily,
  colorScheme,
  ...props
}) => {
  const [checked, setChecked] = useState(initialChecked);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = filterOptions(props);

  const align =
    { left: "flex-start", right: "flex-end" }[alignment] ?? "center";

  const styles = {
    textColor,
    fontSize,
    fontFamily,
    colorScheme,
  };

  useEffect(() => setIsValidResponse(!!checked), [checked]);
  const handleSelection = (option) => {
    // keep our state consistent
    setSelectedOption(option);

    // also update the platform
    setNextEnabled(true);
    logResults(JSON.parse(option));
  };

  return (
    <Flex w="100%" justify={align}>
      {createElement(CheckboxList, {
        selectedOption,
        options,
        onSelection: handleSelection,
        ...styles,
      })}
    </Flex>
  );
};

ResponseItem.params = params;

export default ResponseItem;
