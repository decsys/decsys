// This module exports public helpers for building a Param Spec
// Think of it a bit like PropTypes.<type>
// It also essentially enumerates the subset of PropTypes supported for Component Params.

// TODO: we can support UI tooltips in param specs :)

import * as types from "./types";
import ParamType from "./ParamType";

/**
 * Spec this Parameter as a string,
 * with the default value specfied, or an empty string.
 *
 * Use `stringUndefined()` if you don't want an empty string by default.
 * @param {*} label
 * @param {*} defaultValue
 */
export const string = (label, defaultValue = "") =>
  new ParamType(label, types.string, defaultValue);

/**
 * Spec this Parameter as a string,
 * with NO default value.
 * @param {*} label
 */
export const stringUndefined = label => new ParamType(label, types.string);

/**
 * Spec this Parameter as an enum,
 * accepting only the valid values provided.
 *
 * The default value must be one of the valid values.
 * @param {*} label
 * @param {*} validValues
 * @param {*} defaultValue
 */
export const oneOf = (label, validValues, defaultValue) =>
  new ParamType(label, types.oneOf, defaultValue, validValues);

/**
 * Spec this Parameter as a number,
 * with the default value specifed, or `0`.
 * @param {*} label
 * @param {*} defaultValue
 */
export const number = (label, defaultValue = 0) =>
  new ParamType(label, types.number, defaultValue);

/**
 * Spec this Parameter as a boolean,
 * with the default value specifed, or `false`.
 * @param {*} label
 * @param {*} defaultValue
 */
export const bool = (label, defaultValue = false) =>
  new ParamType(label, types.bool, defaultValue);
