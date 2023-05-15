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
  min,
  max,
  precision,
  defaultValue,
  _context: { setIsValidResponse, logResults, clearResult },
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (num) => {
    setValue(num);

    if (num === null || num === "") {
      clearResult();
    }
    if (min <= num && num <= max) {
      setIsValidResponse(true);
      logResults({ value: num });
    } else {
      setIsValidResponse(false);
    }
  };

  return (
    <NumberInput
      min={min}
      max={max}
      precision={precision}
      defaultValue={value}
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
