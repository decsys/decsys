import React, { useEffect, useState } from "react";
import * as props from "./Component.props";
import { FormCheck, Checkbox, FormCheckLabel } from "@smooth-ui/core-sc";

const Component = ({ label, confirmed: initialChecked, setNextEnabled, logResults }) => {
  const [checked, setChecked] = useState(initialChecked);
  useEffect(() => setNextEnabled(!!checked), [checked])

  const id = new Date().getTime();

  const handleChange = e => {
    logResults({ confirmed: e.target.checked });
    setChecked(e.target.checked);
  };

  return (
    <FormCheck mr={2}>
      <Checkbox
        control
        size="lg"
        id={id}
        checked={checked}
        onChange={handleChange}
      />
      <FormCheckLabel htmlFor={id}>{label}</FormCheckLabel>
    </FormCheck>
  );
};

Component.params = props.params
Component.propTypes = props.propTypes;
Component.defaultProps = props.defaultProps;

export default Component;
