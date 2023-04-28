import { types } from "@decsys/param-types";
import {
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import { useDerivedState } from "hooks/useDerivedState";
import useDeferredAction from "hooks/useDeferredAction";

/**
 * Try and convert a string to a number, else use a fallback value
 */
const convertStringToNumber = (text, fallback) => {
  const n = parseFloat(text);
  return isNaN(n) ? fallback : n;
};

const useDeferredChangeHandler = (paramKey, init, onChange) => {
  const [value, setValue] = useDerivedState(init);

  const deferredOnChange = useDeferredAction(
    (inputValue) => onChange(paramKey, inputValue),
    500
  );

  const handleValueChange = (e) => {
    //at time of writing,
    //Number Inputs send string values;
    //everything else sends SyntheticEvents
    let inputValue;
    switch (typeof e) {
      case "string":
        // make sure we convert back to a number, though!
        // else items may receive strings they weren't expecting, and do invalid math!
        inputValue = convertStringToNumber(e, init);
        break;
      case "object":
        inputValue = e.target.value;
        break;
      default:
        throw new TypeError("expected a SyntheticEvent or a string");
    }

    setValue(inputValue);
    deferredOnChange(inputValue);
  };

  return [value, handleValueChange];
};

const Param = ({ paramKey, value, type, oneOf, onChange }) => {
  // use this for text inputs to allow the user to finish changing things
  // before saving
  const [text, deferredHandleChange] = useDeferredChangeHandler(
    paramKey,
    value,
    onChange
  );

  const handleCheckedChange = (e) => {
    onChange(paramKey, e.target.checked);
  };
  const handleValueChange = (e) => {
    onChange(paramKey, e.target.value);
  };

  const input = ((type) => {
    switch (type) {
      case types.string:
        return (
          <Input
            size="sm"
            type="text"
            onChange={deferredHandleChange}
            value={text}
          />
        );
      case types.bool:
        return <Checkbox isChecked={value} onChange={handleCheckedChange} />;
      case types.oneOf:
        return (
          <Select size="sm" onChange={handleValueChange} value={value}>
            {oneOf.map((x) => (
              <option key={`${paramKey}_radio_${x}`} value={x}>
                {x}
              </option>
            ))}
          </Select>
        );
      case types.number:
        return (
          <NumberInput
            size="sm"
            step={1}
            value={text}
            onChange={deferredHandleChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );
      default:
        throw new Error("Unknown Parameter type");
    }
  })(type);

  return input;
};

export default Param;
