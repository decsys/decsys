import { useEffect, useState } from "react";
import { params } from "./ResponseItem.params";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const ResponseItem = ({
  onChange,
  min,
  max,
  precision,
  defaultValue,
  _context: { logResults, setIsValidResponse },
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setIsValidResponse(true);
  }, [setIsValidResponse]);

  const handleChange = (value) => {
    logResults(value);
    setValue(value);
  };
  return (
    <NumberInput
      onChange={handleChange}
      min={min}
      max={max}
      precision={precision}
      defaultValue={value}
      {...props}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

ResponseItem.params = params;

export default ResponseItem;
