import React from "react";
import { RadioGroup, Stack, Radio } from "@chakra-ui/core";
import { useDerivedState } from "hooks/useDerivedState";

export const OneOfControl = ({
  paramKey,
  value,
  paramType: { validValues },
  propPath,
  onChange,
}) => {
  const [localValue, setLocalValue] = useDerivedState(
    ({ value, fallback }) => value ?? fallback,
    { value, fallback: validValues[0] }
  );

  const handleValueChange = (v) => {
    onChange(propPath, v);
    setLocalValue(v);
  };

  return (
    <RadioGroup onChange={handleValueChange} value={localValue}>
      <Stack direction="row">
        {validValues.map((x) => (
          <Radio
            key={`${paramKey}_radio_${x}`}
            borderColor="gray.400"
            name={`${paramKey}_radio`}
            value={x}
          >
            {x}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};
