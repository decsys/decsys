import ParamTypes from "@decsys/param-types";

// Specify Configurable Parameters
export const params = {
  maxLength: ParamTypes.number("Character Limit", 200),
  regex: ParamTypes.string("Regex Validation"),
  regexMessage: ParamTypes.string("Regex Validation Message"),
};
