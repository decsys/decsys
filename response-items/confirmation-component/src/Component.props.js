import PropTypes from "prop-types";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";

// Specify Configurable Parameters
const params = {
  label: ParamTypes.string(
    "Checkbox Label",
    "I confirm that I have read and understood."
  )
};

// Specify PropTypes for non-Configurable Props
const staticPropTypes = {
  initialChecked: PropTypes.bool
};

// Create merged propTypes, defaultProps
// for Configurable Parameters
// and non-Configurable Props
const { propTypes, defaultProps } = buildPropTypes(params, staticPropTypes);

export { params, propTypes, defaultProps };
