import { useEffect } from "react";
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
  _context: { setIsValidResponse },
}) => {
  const handleChange = () => {};
  useEffect(() => {
    setIsValidResponse(true);
  }, [setIsValidResponse]);

  return (
    <NumberInput
      min={min}
      max={max}
      precision={precision}
      defaultValue={defaultValue}
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
