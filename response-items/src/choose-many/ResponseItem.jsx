import { useEffect, useState, createElement } from "react";
import { params } from "./ResponseItem.params";
import { filterOptions } from "../Choose-one/utils/option-params";
import { Flex, Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";

const ResponseItem = ({
  confirmed: initialChecked,
  _context: { setIsValidResponse, logResults },
  ...props
}) => {
  const [checked, setChecked] = useState(initialChecked);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = filterOptions(props);

  useEffect(() => setIsValidResponse(!!checked), [checked]);
  const handleSelection = (option) => {
    // keep our state consistent
    setSelectedOption(option);

    // also update the platform
    setNextEnabled(true);
    logResults(JSON.parse(option));
  };

  const listComponent = () => (
    <CheckboxGroup colorScheme="green" defaultValue={["naruto", "kakashi"]}>
      <Stack>
        {options.map((option, i) => (
          <Checkbox key={i} option={option} {...props} />
        ))}
      </Stack>
    </CheckboxGroup>
  );

  return (
    <Flex w="100%">
      {createElement(listComponent, {
        selectedOption,
        options,
        onSelection: handleSelection,
      })}
    </Flex>
  );
};

ResponseItem.params = params;

export default ResponseItem;
