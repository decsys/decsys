import { useState, useEffect } from "react";
import { CheckboxGroup, Checkbox, Stack, Text } from "@chakra-ui/react";

const CheckboxListItem = ({
  option,
  textColor,
  fontSize,
  fontFamily,
  colorScheme,
  checked,
  setChecked,
  index,
  logResults,
}) => {
  const handleChange = (e) => {
    const newChecked = [...checked];
    newChecked[index] = e.target.checked;
    logResults(JSON.parse(newChecked));
    setChecked(newChecked);
  };

  return (
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
};

const CheckboxList = ({
  confirmed: initialChecked,
  options,
  setIsValidResponse,
  logResults,
  ...p
}) => {
  const [checked, setChecked] = useState(
    Array(options.length).fill(initialChecked)
  );
  useEffect(() => setIsValidResponse(!!checked), [checked]);

  return (
    <CheckboxGroup>
      <Stack>
        {options.map((option, i) => (
          <CheckboxListItem
            key={i}
            option={option}
            checked={checked}
            setChecked={setChecked}
            logResults={logResults}
            index={i}
            {...p}
          />
        ))}
      </Stack>
    </CheckboxGroup>
  );
};

export default CheckboxList;
