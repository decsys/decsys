import { useState } from "react";
import { params } from "./ResponseItem.params";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const ResponseItem = ({
  _context: { isValidResponse, logResults },
  min,
  max,
  defaultValue,
  precision,
}) => {
  const [value, setValue] = useState(0);
  const handleChange = (value) => {
    setValue(value);
    logResults(JSON.parse(option));
  };
  return (
    <NumberInput
      defaultValue={value}
      precision={precision}
      min={min}
      max={max}
      onChange={handleChange}
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
