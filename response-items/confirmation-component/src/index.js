import React from "react";
import PropTypes from "prop-types";
import { FormCheck, Checkbox, FormCheckLabel } from "@smooth-ui/core-sc";
import paramTypes, { setParams } from "@decsys/param-types/";
import Check from "styled-icons/fa-solid/Check";

const Confirm = ({ label, initialChecked }) => {
  const id = new Date().getTime();
  return (
    <FormCheck mr={2}>
      <Checkbox control size="lg" id={id} checked={initialChecked} />
      <FormCheckLabel htmlFor={id}>{label}</FormCheckLabel>
    </FormCheck>
  );
};

//set parameter metadata, including propTypes and defaultProps
setParams(Confirm, {
  label: paramTypes.string(
    "Checbox Label",
    "I confirm that I have read and understood."
  )
});

// propTypes and defaultProps for non-parameter props (e.g. results)
Confirm.propTypes = {
  initialChecked: PropTypes.bool
};

// Metadata properties
Confirm.version = "0.1.0";
Confirm.icon = React.createElement(Check);

export default Confirm;
