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
  precision,
  defaultValue,
  _context: { setIsValidResponse, logResults },
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setIsValidResponse(value !== null);
  }, [value]);

  const handleChange = (num) => {
    logResults({ value: num });
    setValue(num);
  };
  console.log("min:", min);
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
