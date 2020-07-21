import PropTypes from "prop-types";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";

// Specify Configurable Parameters
const params = {
  label: ParamTypes.string("label", "Enter some text")
};

// Specify PropTypes for non-Configurable Props
const staticPropTypes = {
  text: PropTypes.string,
  logResults: PropTypes.func.isRequired,
  setNextEnabled: PropTypes.func.isRequired
};

// Specify Defaults for non-Configurable Props
const staticDefaultProps = {
  text: ""
};

// Create merged propTypes, defaultProps
// for Configurable Parameters
// and non-Configurable Props
const { propTypes, defaultProps } = buildPropTypes(
  params,
  staticPropTypes,
  staticDefaultProps
);

export { params, propTypes, defaultProps };
