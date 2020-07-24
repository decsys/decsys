import PropTypes from "prop-types";
import ParamTypes, {
  buildPropTypes,
  renderContextPropTypes,
} from "@decsys/param-types";

// Specify Configurable Parameters
const params = {
  label: ParamTypes.string(
    "Checkbox Label",
    "I confirm that I have read and understood the instructions, and that I wish to proceed."
  ),
};

// Specify PropTypes for non-Configurable Props
const staticPropTypes = {
  confirmed: PropTypes.bool,
  ...renderContextPropTypes,
};

// Create merged propTypes, defaultProps
// for Configurable Parameters
// and non-Configurable Props
const { propTypes, defaultProps } = buildPropTypes(params, staticPropTypes);

export { params, propTypes, defaultProps };
