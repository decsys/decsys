import React from "react";
import { Checkbox } from "@chakra-ui/core";
import { useDerivedState } from "hooks/useDerivedState";

export const BoolControl = ({
  paramKey,
  value = false,
  paramType,
  propPath,
  onChange,
}) => {
  const [localValue, setLocalValue] = useDerivedState(value);

  const handleCheckedChange = (e) => {
    e.persist(); // TODO: remove in React 17
    setLocalValue(e.target.checked);
    onChange(propPath, e.target.checked);
  };

  return (
    <Checkbox
      isChecked={localValue}
      onChange={handleCheckedChange}
      p=".1em"
      borderColor="gray.400"
    >
      {paramType.label || paramKey}
    </Checkbox>
  );
};
