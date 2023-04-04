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
  label,
  confirmed: initialChecked,
  _context: { isValidResponse, logResults },
}) => {
  const [checked, setChecked] = useState(initialChecked);
  useEffect(() => isValidResponse(!!checked), [checked]);

  const handleChange = (e) => {
    logResults({ confirmed: e.target.checked });
    setChecked(e.target.checked);
  };

  return (
    <NumberInput
      defaultValue={defaultValue}
      precision={precision}
      min={min}
      max={max}
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
