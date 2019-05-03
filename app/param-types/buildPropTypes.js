import * as types from "./types";
import PropTypes from "prop-types";

/**
 * Builds React `propTypes` and `defaultProps` objects for your component
 * based on your component's ParamTypes.
 * @param {*} params - your component's ParamTypes spec
 * @param {*} propTypes - any non ParamTypes based PropTypes you want included
 * @param {*} defaultProps - any non ParamTypes based defaultProps you want included
 */
const buildPropTypes = (params, propTypes, defaultProps) => {
  const x = {
    propTypes: propTypes || {},
    defaultProps: defaultProps || {}
  };
  for (const param in params) {
    switch (param.type) {
      case types.string:
      case types.number:
      case types.bool:
        x.propTypes[param] = PropTypes[param.type];
        break;
      case types.oneOf:
        x.propTypes[param] = PropTypes.oneOf(param.oneOf);
    }
    x.defaultProps[param] = param.defaultValue;
  }
  return x;
};

export default buildPropTypes;
