import { useEffect, useState, createElement, useRef } from "react";
import { params } from "./ResponseItem.params";
import { filterOptions } from "../Choose-one/utils/option-params";
import { Flex, Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import CheckboxList from "./components/CheckboxList";

const ResponseItem = ({
  confirmed: initialChecked,
  _context: { setIsValidResponse, logResults },
  width,
  textColor,
  fontSize,
  fontFamily,
  ...props
}) => {
  const [checked, setChecked] = useState(initialChecked);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = filterOptions(props);
  const styles = {
    width,
    textColor,
    fontSize,
    fontFamily,
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
    <Flex w="100%">
      {createElement(CheckboxList, {
        selectedOption,
        options,
        onSelection: handleSelection,
      })}
    </Flex>
  );
};

ResponseItem.params = params;

export default ResponseItem;
