import { CheckboxGroup, Checkbox, Stack, Text } from "@chakra-ui/react";

const CheckboxListItem = ({ option }) => (
  <Checkbox value={JSON.stringify(option)}>
    <Text as="span">{option.label}</Text>
  </Checkbox>
);

const CheckboxList = ({ options, onSelection, ...p }) => (
  <CheckboxGroup colorScheme="green" onChange={onSelection}>
    <Stack>
      {options.map((option, i) => (
        <CheckboxListItem key={i} option={option} {...p} />
      ))}
    </Stack>
  </CheckboxGroup>
);
export default CheckboxList;
