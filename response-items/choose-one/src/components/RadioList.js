import { useRef } from "react";
import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";

const RadioListItem = ({ textColor, fontSize, fontFamily, option }) => (
  <Radio value={JSON.stringify(option)}>
    <Text
      as="span"
      color={textColor}
      fontSize={fontSize}
      fontFamily={fontFamily}
    >
      {option.label}
    </Text>
  </Radio>
);

const RadioList = ({ selectedOption, options, onSelection, ...p }) => {
  const name = useRef(Date.now());

  return (
    <RadioGroup
      name={name.current}
      onChange={onSelection}
      value={selectedOption}
    >
      <Stack>
        {options.map((option, i) => (
          <RadioListItem key={i} option={option} {...p} />
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default RadioList;
