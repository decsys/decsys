import ParamTypes from "@decsys/param-types";

// Specify Configurable Parameters
export const params = {
  min: ParamTypes.number("Min Value", 0),
  max: ParamTypes.number("Max Value", 100),
  defaultValue: ParamTypes.number("Default Value", 0),
  precision: ParamTypes.number("Precision Value", 2),
};
