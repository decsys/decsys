import React, { useState, useEffect } from "react";
import { types } from "@decsys/param-types";
import {
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/core";

const useDelayedChangeHandler = (paramKey, init, onChange) => {
  const [timer, setTimer] = useState();

  const [value, setValue] = useState(init); // we use local state so updates work without delay
  useEffect(() => setValue(init), [init]); // but still ensure update when new props come in

  const delayedHandleValueChange = (e) => {
    //at time of writing,
    //Number Inputs send string values;
    //everything else sends SyntheticEvents
    let inputValue;
    switch (typeof e) {
      case "string":
        inputValue = e;
        break;
      case "object":
        inputValue = e.target.value;
        e.persist();
        break;
      default:
        throw new TypeError("expected a SyntheticEvent or a string");
    }

    setValue(inputValue); // update our local state

    //delay, then fire the onChange passed in to update remote state
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onChange(paramKey, inputValue), 500));
  };

  return [value, delayedHandleValueChange];
};

const Param = ({ paramKey, value, type, oneOf, onChange }) => {
  // use this for text inputs to allow the user to finish changing things
  // before saving
  const [text, delayedHandleChange] = useDelayedChangeHandler(
    paramKey,
    value,
    onChange
  );

  const handleCheckedChange = (e) => {
    e.persist();
    onChange(paramKey, e.target.checked);
  };
  const handleValueChange = (value) => {
    onChange(paramKey, value);
  };

  const input = ((type) => {
    switch (type) {
      case types.string:
        return (
          <Input
            size="sm"
            type="text"
            onChange={delayedHandleChange}
            value={text}
          />
        );
      case types.bool:
        return <Checkbox isChecked={value} onChange={handleCheckedChange} />;
      case types.oneOf:
        return (
          <RadioGroup onChange={handleValueChange} value={value}>
            <Stack direction="row">
              {oneOf.map((x) => (
                <Radio
                  key={`${paramKey}_radio_${x}`}
                  name={`${paramKey}_radio`}
                  value={x}
                >
                  {x}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case types.number:
        return (
          <NumberInput
            size="sm"
            step={1}
            defaultValue={text}
            onChange={delayedHandleChange}
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
