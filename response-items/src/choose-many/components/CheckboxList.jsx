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
}) => {
  const handleChange = (e) => {
    const newChecked = [...checked];
    newChecked[index] = e.target.checked;
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
  confirmed,
  options,
  minCheck,
  maxCheck,
  _context: { setIsValidResponse },
  ...p
}) => {
  const [checked, setChecked] = useState(Array(options.length).fill(confirmed));

  useEffect(() => {
    const checkedCount = checked.filter(Boolean).length;
    if (minCheck >= checkedCount && maxCheck <= checkedCount) {
      setIsValidResponse(true);
    }
  }, [checked, minCheck, maxCheck, setIsValidResponse]);

  return (
    <CheckboxGroup>
      <Stack>
        {options.map((option, i) => (
          <CheckboxListItem
            key={i}
            option={option}
            checked={checked}
            setChecked={setChecked}
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
