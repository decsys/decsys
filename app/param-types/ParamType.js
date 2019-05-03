import * as types from "./types";
import PropTypes from "prop-types";

/**
 * This is a parameter specification of sorts.
 *
 * It holds metadata about a Parameter's type and other properties.
 *
 * It can provide a React PropType value for the parameter.
 */
class ParamType {
  constructor(label = "", type, defaultValue, oneOf) {
    if (oneOf && !Array.isArray(oneOf))
      throw Error("oneOf must be an array or nothing.");
    if (oneOf && type === types.oneOf && !oneOf.includes(defaultValue))
      throw Error(
        "Param is of type `oneOf`, but the default value is invalid."
      );
    if (!Object.keys(types).includes(type)) throw Error("Param Type is invalid");

    this._label = label;
    this._type = type;
    this._oneOf = oneOf;
    this._defaultValue = defaultValue;
    this._propType =
      this._type === types.oneOf
        ? PropTypes[this._type](this._oneOf)
        : PropTypes[this._type];
  }

  get label() {
    return this._label;
  }

  get type() {
    return this._type;
  }

  get oneOf() {
    return this._oneOf;
  }

  get defaultValue() {
    return this._defaultValue;
  }

  get propType() {
    return this._propType;
  }
}

export default ParamType;
