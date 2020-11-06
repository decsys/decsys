import React from "react";
import { Input, Stack, Flex } from "@chakra-ui/core";
import { useDerivedState } from "hooks/useDerivedState";
import { useDeferredAction } from "hooks/useDeferredAction";

export const StringControl = ({
  paramType,
  propPath,
  value = "",
  onChange,
}) => {
  const [text, setText] = useDerivedState(value);
  const deferHandleChange = useDeferredAction(onChange, 500);

  const handleChange = (e) => {
    e.persist(); // TODO: React 17
    setText(e.target.value);
    deferHandleChange(propPath, e.target.value);
  };

  return (
    <Stack direction="row">
      <Input
        borderColor="gray.400"
        size="sm"
        type="text"
        onChange={handleChange}
        value={text}
        maxLength={paramType.limit}
      />
      {paramType.limit && (
        <Flex minW="150px" color="gray.500" align="center">
          ({text.length} of {paramType.limit})
        </Flex>
      )}
    </Stack>
  );
};
