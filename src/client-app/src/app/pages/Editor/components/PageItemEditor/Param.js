import React, { useState, useEffect } from "react";
import { FlexBox } from "components/core";
import {
  SmoothInput,
  Checkbox,
  Radio,
  FormCheck,
  FormCheckLabel
} from "@smooth-ui/core-sc";
import { types } from "@decsys/param-types";
import { Input } from "@chakra-ui/core";

const useDelayedChangeHandler = (paramKey, init, onChange) => {
  const [timer, setTimer] = useState();

  const [value, setValue] = useState(init); // we use local state so updates work without delay
  useEffect(() => setValue(init), [init]); // but still ensure update when new props come in

  const delayedHandleValueChange = e => {
    setValue(e.target.value); //update local state
    e.persist();
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onChange(paramKey, e.target.value), 500));
  };

  return [value, delayedHandleValueChange];
};

const StandardInput = ({
  paramKey,
  value: init,
  onChange,
  inputType = "text",
  ...p
}) => {
  const [value, handleChange] = useDelayedChangeHandler(
    paramKey,
    init,
    onChange
  );

  return (
    <Input
      size="sm"
      type={inputType}
      onChange={handleChange}
      value={value}
      {...p}
    />
  );
};

const Param = ({ paramKey, value, type, oneOf, onChange }) => {
  const [timer, setTimer] = useState();

  const [text, setText] = useState(value); // we use local state so updates work without delay
  useEffect(() => setText(value), [value]); // but still ensure update when new name props come in

  const delayedHandleValueChange = e => {
    setText(e.target.value); //update local state
    e.persist();
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onChange(paramKey, e.target.value), 500));
  };

  const handleCheckedChange = e => {
    e.persist();
    onChange(paramKey, e.target.checked);
  };
  const handleValueChange = e => {
    e.persist();
    onChange(paramKey, e.target.value);
  };

  const input = (type => {
    switch (type) {
      case types.string:
        return (
          <StandardInput
            paramKey={paramKey}
            value={value}
            onChange={onChange}
          />
        );
      case types.bool:
        return <Checkbox checked={value} onChange={handleCheckedChange} />;
      case types.oneOf:
        return (
          <FlexBox>
            {oneOf.map(x => (
              <FormCheck key={`${paramKey}_radio_${x}`} mr={2}>
                <Radio
                  size="sm"
                  name={`${paramKey}_radio`}
                  id={`${paramKey}_radio_${x}`}
                  value={x}
                  checked={x === value}
                  onChange={handleValueChange}
                />
                <FormCheckLabel htmlFor={`${paramKey}_radio_${x}`}>
                  {x}
                </FormCheckLabel>
              </FormCheck>
            ))}
          </FlexBox>
        );
      case types.number:
        return (
          <StandardInput
            paramKey={paramKey}
            inputType="number"
            value={value}
            onChange={onChange}
          />
        );
      default:
        throw new Error("Unknown Parameter type");
    }
  })(type);

  return input;
};

export default Param;
