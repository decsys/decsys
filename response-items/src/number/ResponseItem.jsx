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
  min,
  max,
  defaultValue,
  precision,
  _context: { isValidResponse, logResults },
}) => {
  const [value, setValue] = useState(0);
  const handleChange = (value) => {
    setValue(value);
    isValidResponse(true);
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
