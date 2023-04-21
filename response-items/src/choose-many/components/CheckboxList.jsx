import { useState, useEffect } from "react";
import { CheckboxGroup, Checkbox, Stack, Text } from "@chakra-ui/react";

const CheckboxListItem = ({
  option,
  textColor,
  fontSize,
  fontFamily,
  colorScheme,
  checked,
  handleChange,
  index,
}) => (
  <Checkbox
    colorScheme={colorScheme}
    isChecked={checked[index]}
    onChange={handleChange}
    value={JSON.stringify(option)}
  >
    <Text
      as="span"
      color={textColor}
      fontSize={fontSize}
      fontFamily={fontFamily}
    >
      {option.label}
    </Text>
  </Checkbox>
);

const CheckboxList = ({
  confirmed,
  options,
  minCheck,
  maxCheck,
  _context: { setIsValidResponse, logResults },
  ...p
}) => {
  const [checked, setChecked] = useState(Array(options.length).fill(confirmed));

  const handleChange = (e, index) => {
    const newChecked = [...checked];
    newChecked[index] = e.target.checked;
    setChecked(newChecked);

    const newSelected = newChecked
      .map((isChecked, idx) => (isChecked ? options[idx] : null))
      .filter((option) => option !== null);

    const checkedCount = newSelected.length;
    const isValid = minCheck <= checkedCount && checkedCount <= maxCheck;

    setIsValidResponse(isValid);

    if (isValid) {
      logResults(newSelected);
    }
  };

  return (
    <CheckboxGroup>
      <Stack>
        {options.map((option, i) => (
          <CheckboxListItem
            key={i}
            option={option}
            checked={checked}
            setChecked={setChecked}
            handleChange={(e) => handleChange(e, i)}
            maxCheck={maxCheck}
            index={i}
            {...p}
          />
        ))}
      </Stack>
    </CheckboxGroup>
  );
};

export default CheckboxList;
