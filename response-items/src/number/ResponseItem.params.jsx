import ParamTypes from "@decsys/param-types";

export const params = {
  min: ParamTypes.number("Min Value", -10),
  max: ParamTypes.number("Max Value", 10),
  defaultValue: ParamTypes.number("Default Value", 0),
  precision: ParamTypes.number("Precision Value", 1),
};
