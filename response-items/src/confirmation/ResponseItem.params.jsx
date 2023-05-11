import ParamTypes from "@decsys/param-types";

// Specify Configurable Parameters
export const params = {
  label: ParamTypes.string(
    "Checkbox Label",
    "I confirm that I have read and understood the instructions, and that I wish to proceed."
  ),
};
