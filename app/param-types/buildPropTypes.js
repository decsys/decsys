import * as types from "./types";
import PropTypes from "prop-types";

/**
 * Builds React `propTypes` and `defaultProps` objects for a Component
 * based on the Component's ParamTypes.
 * @param {*} params - The Component's ParamTypes spec
 * @param {*} propTypes - any non ParamTypes based `propTypes` to include
 * @param {*} defaultProps - any non ParamTypes based `defaultProps` to include
 */
const buildPropTypes = (params, propTypes, defaultProps) => {
  const x = {
    propTypes: propTypes || {},
    defaultProps: defaultProps || {}
  };
  for (const key in params) {
    const param = params[key];
    switch (param.type) {
      case types.string:
      case types.number:
      case types.bool:
        x.propTypes[key] = PropTypes[param.type];
        break;
      case types.oneOf:
        x.propTypes[key] = PropTypes.oneOf(param.oneOf);
    }
    x.defaultProps[key] = param.defaultValue;
  }
  return x;
};

export default buildPropTypes;
