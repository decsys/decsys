import React from "react";
import { FlexBox } from "../ui";
import {
  Typography,
  Input,
  Checkbox,
  Radio,
  FormCheck,
  FormCheckLabel
} from "@smooth-ui/core-sc";
import { types } from "../../../param-types";

const Param = ({ paramKey, value, type, oneOf, onChangeValue }) => {
  const input = (type => {
    switch (type) {
      case types.string:
        return (
          <Input control size="sm" value={value} onChange={onChangeValue} />
        );
      case types.bool:
        return <Checkbox checked={value} onChange={onChangeValue} />;
      case types.oneOf:
        return (
          <FlexBox>
            {oneOf.map(x => (
              <FormCheck mr={2}>
                <Radio
                  size="sm"
                  name={`${paramKey}_radio`}
                  id={`${paramKey}_radio_${x}`}
                  value={x}
                  checked={x === value}
                  onChange={onChangeValue}
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
          <Input
            size="sm"
            type="number"
            value={value}
            onChange={onChangeValue}
          />
        );
    }
  })(type);

  return <FlexBox width={1}>{input}</FlexBox>;
};

export default Param;
