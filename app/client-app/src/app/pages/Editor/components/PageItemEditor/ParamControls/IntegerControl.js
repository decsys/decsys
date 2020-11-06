import React from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Flex,
} from "@chakra-ui/core";
import { useDerivedState } from "hooks/useDerivedState";
import { useDeferredAction } from "hooks/useDeferredAction";

export const IntegerControl = ({
  value = 0,
  paramType,
  propPath,
  onChange,
}) => {
  const lower = paramType.min != null;
  const upper = paramType.max != null;
  const range = lower && upper;

  const [number, setNumber] = useDerivedState(value);
  const deferHandleChange = useDeferredAction((path, value) => {
    // clamp
    if (lower && value < paramType.min) value = paramType.min;
    if (upper && value > paramType.max) value = paramType.max;
    setNumber(value);

    onChange(path, value);
  }, 500);

  const handleChange = (number) => {
    setNumber(number);
    deferHandleChange(propPath, number);
  };

  return (
    <Stack direction="row">
      <NumberInput
        size="sm"
        step={1}
        value={number}
        onChange={handleChange}
        // blurring when deleting a focused field is problematic.
        // so instead we manually clamp in our change handler, above.
        clampValueOnBlur={false}
        min={paramType.min}
        max={paramType.max}
        maxW="150px"
      >
        <NumberInputField borderColor="gray.400" />
        <NumberInputStepper borderColor="gray.400">
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {(upper || lower) && (
        <Flex color="gray.500" align="center">
          (
          {range
            ? `between ${paramType.min} and ${paramType.max}`
            : (upper && `up to ${paramType.max}`) ||
              (lower && `${paramType.min} or higher`)}
          )
        </Flex>
      )}
    </Stack>
  );
};
