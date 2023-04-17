import { CheckboxGroup, Checkbox, Stack, Text } from "@chakra-ui/react";

const CheckboxListItem = ({ option, textColor, fontSize, fontFamily }) => (
  <Checkbox value={JSON.stringify(option)}>
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

const CheckboxList = ({ options, onSelection, colorScheme, ...p }) => (
  <CheckboxGroup colorScheme={colorScheme} onChange={onSelection}>
    <Stack>
      {options.map((option, i) => (
        <CheckboxListItem key={i} option={option} {...p} />
      ))}
    </Stack>
  </CheckboxGroup>
);
export default CheckboxList;
