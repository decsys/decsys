import * as types from "./types";
import PropTypes from "prop-types";

const setParams = (component, params) => {
  // first set params to our nice metadata
  // TODO: validate?
  component.params = params;

  // set propTypes for you
  // set defaultProps for you
  component.propTypes = component.propTypes || {};
  component.defaultProps = component.defaultProps || {};
  for (const param in params) {
    switch (param.type) {
      case types.string:
      case types.number:
      case types.bool:
        component.propTypes[param] = PropTypes[param.type];
        break;
      case types.oneOf:
        component.propTypes[param] = PropTypes.oneOf(param.oneOf);
    }
    component.defaultProps[param] = param.defaultValue;
  }
};

export default setParams;
