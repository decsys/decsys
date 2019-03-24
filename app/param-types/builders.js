// This module exports public helpers for building a Param Spec
// Think of it a bit like PropTypes.<type>
// It also essentially enumerates the subset of PropTypes supported for Component Params.

// TODO: we can support UI tooltips in param specs :)

import * as types from "./types";

const build = (label, type, defaultValue, oneOf) => {
  // Some validation I guess
  if (oneOf && !Array.isArray(oneOf))
    throw Error("enumValues must be an array or nothing.");
  if (oneOf && type === types.oneOf && !oneOf.includes(defaultValue))
    throw Error("Param is an enum, but the default value is invalid.");

  // return params object
  return {
    label,
    type,
    oneOf,
    defaultValue
  };
};

/**
 * Spec this Parameter as a string,
 * with the default value specfied, or an empty string.
 *
 * Use `stringUndefined()` if you don't want an empty string by default.
 * @param {*} label
 * @param {*} defaultValue
 */
export const string = (label, defaultValue = "") =>
  build(label, types.string, defaultValue);

/**
 * Spec this Parameter as a string,
 * with NO default value.
 * @param {*} label
 */
export const stringUndefined = label => build(label, types.string);

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
  build(label, types.oneOf, defaultValue, validValues);

/**
 * Spec this Parameter as a number,
 * with the default value specifed, or `0`.
 * @param {*} label
 * @param {*} defaultValue
 */
export const number = (label, defaultValue = 0) =>
  build(label, types.number, defaultValue);

/**
 * Spec this Parameter as a boolean,
 * with the default value specifed, or `false`.
 * @param {*} label
 * @param {*} defaultValue
 */
export const bool = (label, defaultValue = false) =>
  build(label, types.bool, defaultValue);
