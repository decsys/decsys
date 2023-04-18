import ParamTypes from "@decsys/param-types";

export const params = {
  min: ParamTypes.number("Min Value", 0),
  max: ParamTypes.number("Max Value", 100),
  precision: ParamTypes.number("Precision Value", 0),
  defaultValue: ParamTypes.string("Default Value"),
};
