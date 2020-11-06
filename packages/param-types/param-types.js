import {
  isArray,
  isBoolean,
  isNumber,
  isParamType,
  isPlainObject,
  isString,
} from "./helpers";

export const types = {
  /** String Param */
  string: "string",

  /** Integer Param */
  integer: "integer",

  /** Boolean Param */
  bool: "bool",

  /** Array of Params of a single type */
  arrayOf: "arrayOf",

  /** Enum Param. Param value must be one of the enumerated values. */
  oneOf: "oneOf",

  /** Color Param. Param value is a string, expected to be a valid CSS color. */
  color: "color",

  /**
   * Object Param that takes a particular shape.
   *
   * - Can be used as a logical grouping only (with `flatPaths` or if child paths are overridden.)
   * - Can be used to define a Dictionary Param structure.
   */
  shape: "shape",
};

//#region Type definitions
// --------------------------------------------------------------------
// We use JSDoc to define options types to enhance developer experience
// --------------------------------------------------------------------

/**
 * @typedef ParamTypeOptions
 * @prop {string} [label] UI Label for this Param.
 * If omitted, will use the key for this value in the `paramTypes` dictionary.
 * @prop {string} [path] Path to the Component Prop node for this Param.
 * If omitted, a nested path will be constructed based on position in the `paramTypes` dictionary.
 * @prop {string} [info] Extra information about the Param to be provided as help text in the UI.
 */

/**
 * @typedef ExtraValueTypeOptions
 * @prop {*} [default] The default value for this Param.
 */
/** @typedef {ExtraValueTypeOptions | ParamTypeOptions} ValueTypeOptions */

/**
 * @typedef StringTypeOptions
 * @prop {number} [limit] A character limit for the Param value.
 */
/**
 * @typedef StringConstructorOptions
 * @prop {boolean} [defaultUndefined] If no `default` is provided, use `undefined` instead of an empty string `""`.
 */

/**
 * @typedef IntegerTypeOptions
 * @prop {number} [min] The lowest acceptable value
 * @prop {number} [max] The highest acceptable value
 */

/**
 * @typedef ArrayOfTypeOptions
 * @prop {number} [limit] The maximum number of items allowed in the array.
 */

/**
 * @typedef ShapeTypeOptions
 * @prop {boolean} [flatPaths]
 * If true, paths for children will not be nested under the path to this Param:
 * instead they will be flattened, starting from the root.
 */

//#endregion

//#region Param Type declarations
// --------------------------------------------------------------------
// Param Types are declared and constructed using classical inheritance
// to validate shared options
// --------------------------------------------------------------------

/**
 * Base internal ParamType constructor.
 * All ParamTypes are an instance of this.
 */
export class ParamType {
  /**
   * @param {Types} type
   * @param {ParamTypeOptions} [options]
   */
  constructor(type, { label, path, info } = {}) {
    if (!Object.keys(types).some((k) => types[k] === type))
      throw new Error(`Invalid Param Type: ${type}`);
    this.type = type;

    if (label) {
      isString(label, "label");
      this.label = label;
    }

    if (path) {
      isString(path, "path");
      this.path = path;
    }

    if (info) {
      isString(info, "info");
      this.info = info;
    }
  }
}

/**
 * Base internal Value ParamType. Includes a default value option.
 */
class ValueType extends ParamType {
  /**
   * @param {*} type
   * @param {ValueTypeOptions} [options]
   */
  constructor(type, { default: def, ...options } = {}) {
    super(type, options);
    this.default = def;
  }
}

class StringType extends ValueType {
  /**
   * @param {StringTypeOptions | ValueTypeOptions} [options]
   * @param {StringConstructorOptions} [constructorOptions] Options for how this constructor should behave
   */
  constructor(
    { limit, default: def, ...options } = {},
    { defaultUndefined } = {}
  ) {
    limit != null && isNumber(limit, "limit");
    def != null && isString(def, "default");

    super(types.string, {
      ...options,
      default: def ?? (defaultUndefined ? undefined : ""),
    });

    this.limit = limit;
  }
}

class IntegerType extends ValueType {
  /** @param {IntegerTypeOptions | ValueTypeOptions} [options] */
  constructor({ min, max, default: def, ...options } = {}) {
    min != null && isNumber(min, "min");
    max != null && isNumber(max, "max");
    def != null && isNumber(def, "default");
    // TODO: check min is less than max?

    super(types.integer, { ...options, default: def ?? 0 });
    this.min = min;
    this.max = max;
  }
}

class BoolType extends ValueType {
  /** @param {ValueTypeOptions} [options] */
  constructor({ default: def, ...options } = {}) {
    def != null && isBoolean(def, "default");
    super(types.bool, { ...options, def });
  }
}

class ColorType extends ValueType {
  /** @param {ValueTypeOptions} [options] */
  constructor({ default: def, ...options } = {}) {
    def != null && isString(def, "default");
    super(types.color, { ...options, def });
  }
}

class OneOfType extends ValueType {
  /**
   * @param {Array} validValues An array of values to choose from.
   * @param {ValueTypeOptions} [options]
   */
  constructor(validValues, { default: def, ...options } = {}) {
    isArray(validValues, "validValues");
    // TODO: check type homogeny?
    if (validValues.length < 2)
      console.warn(
        "oneOf Param: expected at least 2 values to choose between."
      );

    if (!validValues.includes(def))
      console.warn("oneOf Param: expected `default` to be a valid value.");

    super(types.oneOf, { ...options, default: def });
    this.validValues = validValues;
  }
}

class ArrayOfType extends ParamType {
  /**
   * @param {ParamType} childType
   * @param {ArrayOfTypeOptions | ParamTypeOptions} [options]
   */
  constructor(childType, { limit, ...options } = {}) {
    isParamType(childType, "childType");

    if (limit != null) {
      isNumber(limit, "limit");
      if (limit <= 1)
        console.warn("arrayOf Param: expected `limit` to be greater than 1.");
    }

    super(types.arrayOf, options);
    this.limit = limit;
    this.childType = childType;
  }
}

class ShapeType extends ParamType {
  /**
   * @param {Object.<string,ParamType>} childTypes A Dictionary of ParamType definitions that shape this Param.
   * @param {*} [options]
   */
  constructor(childTypes, { flatPaths, ...options } = {}) {
    isPlainObject(childTypes);
    Object.keys(childTypes).forEach((k) =>
      isParamType(childTypes[k], `childTypes.${k}`)
    );

    flatPaths != null && isBoolean(flatPaths, "flatPaths");

    super(types.shape, options);
    this.flatPaths = flatPaths;
    this.childTypes = childTypes;
  }
}

//#endregion

//#region Public Constructors
// --------------------------------------------------------------------
// To suit the intended public API (mimicking PropTypes),
// simple functions are exported to construct Param Types.
// --------------------------------------------------------------------

/**
 * Construct a `string` ParamType
 * @param {StringTypeOptions | ValueTypeOptions} [options]
 * @param {StringConstructorOptions} [constructorOptions] Options for how this constructor should behave
 */
export const string = (options = {}, constructorOptions = {}) =>
  new StringType(options, constructorOptions);

/**
 * Construct an `integer` ParamType
 * @param {IntegerTypeOptions | ValueTypeOptions} [options]
 */
export const integer = (options = {}) => new IntegerType(options);

/**
 * Construct a `bool` ParamType
 * @param {ValueTypeOptions} [options]
 */
export const bool = (options = {}) => new BoolType(options);

/**
 * Construct a `color` ParamType
 * @param {ValueTypeOptions} [options]
 */
export const color = (options = {}) => new ColorType(options);

/**
 * Construct a `oneOf` ParamType
 * @param {Array} validValues An array of values to choose from.
 * @param {ValueTypeOptions} [options]
 */
export const oneOf = (validValues, options = {}) =>
  new OneOfType(validValues, options);

/**
 * Construct an `arrayOf` ParamType
 * @param {ParamType} childType
 * @param {ArrayOfTypeOptions | ParamTypeOptions} [options]
 */
export const arrayOf = (childType, options = {}) =>
  new ArrayOfType(childType, options);

/**
 * Construct a `shape` ParamType
 * @param {Object.<string,ParamType>} childTypes A Dictionary of ParamType definitions that shape this Param.
 * @param {*} [options]
 */
export const shape = (childTypes, options = {}) =>
  new ShapeType(childTypes, options);

//#endregion
