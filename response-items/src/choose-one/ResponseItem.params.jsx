import ParamTypes from "@decsys/param-types";

// Specify Configurable Parameters
export const params = {
  // Dropdown Flag
  dropDown: ParamTypes.bool("Drop Down?", false),

  // Styling Options
  width: ParamTypes.string("Dropdown Width", "70%"),
  alignment: ParamTypes.oneOf(
    "Alignment",
    ["left", "center", "right"],
    "center"
  ),
  textColor: ParamTypes.string("Text Color", "black"),
  fontSize: ParamTypes.string("Text Size", "1em"),
  fontFamily: ParamTypes.string("Text Font", "Arial"),

  // Qualitivative answers
  option0: ParamTypes.string("Options: 0", "Option 0"),
  option1: ParamTypes.string("1", "Option 1"),
  option2: ParamTypes.string("2", "Option 2"),
  option3: ParamTypes.string("3", "Option 3"),
  option4: ParamTypes.string("4", ""),
  option5: ParamTypes.string("5", ""),
  option6: ParamTypes.string("6", ""),
  option7: ParamTypes.string("7", ""),
  option8: ParamTypes.string("8", ""),
  option9: ParamTypes.string("9", ""),
};
