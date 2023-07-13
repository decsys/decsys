import { Box, Flex, useRadio } from "@chakra-ui/react";

export const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Flex as="label">
      <input {...input} />
      <Flex
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        backgroundColor="gray.200"
        _checked={{
          bg: "gray.200",
          color: "black",
          fontWeight: "bold",
          borderColor: "gray.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={2}
      >
        {props.children}
      </Flex>
    </Flex>
  );
};
