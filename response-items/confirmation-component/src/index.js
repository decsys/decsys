import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormCheck, Checkbox, FormCheckLabel } from "@smooth-ui/core-sc";
import ParamTypes, { buildPropTypes } from "@decsys/param-types/";
import { Check } from "styled-icons/fa-solid/Check";
import { version } from "../package.json";

const Confirm = ({ label, initialChecked, setNextEnabled, logResults }) => {
  useEffect(() => setNextEnabled(false), []);

  const [checked, setChecked] = useState(initialChecked);

  const id = new Date().getTime();

  const handleChange = e => {
    logResults({ confirmed: e.target.checked });
    setChecked(e.target.checked);
    setNextEnabled(e.target.checked);
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

Confirm.params = {
  label: ParamTypes.string(
    "Checkbox Label",
    "I confirm that I have read and understood."
  )
};

const { propTypes, defaultProps } = buildPropTypes(Confirm.params, {
  initialChecked: PropTypes.bool
});
Confirm.propTypes = propTypes;
Confirm.defaultProps = defaultProps;

// Metadata properties
Confirm.version = version;
Confirm.icon = <Check />;

export default Confirm;
