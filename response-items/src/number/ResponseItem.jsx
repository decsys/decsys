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
  _context: { setIsValidResponse, logResults },
}) => {
  const handleChange = () => {};
  useEffect(() => {
    setIsValidResponse(true);
  }, [setIsValidResponse]);

  return (
    <NumberInput
      defaultValue={defaultValue}
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
