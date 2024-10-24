import ParamTypes from "@decsys/param-types";

// Specify Configurable Parameters
export const params = {
  radio1: ParamTypes.string("Option 1", "1"),
  radio1Secondary: ParamTypes.string("Secondary Label 1", "Min"),
  radio2: ParamTypes.string("Option 2", "2"),
  radio2Secondary: ParamTypes.string("Secondary Label 2"),
  radio3: ParamTypes.string("Option 3", "3"),
  radio3Secondary: ParamTypes.string("Secondary Label 3"),
  radio4: ParamTypes.string("Option 4", "4"),
  radio4Secondary: ParamTypes.string("Secondary Label 4"),
  radio5: ParamTypes.string("Option 5", "5"),
  radio5Secondary: ParamTypes.string("Secondary Label 5", "Max"),
  radio6: ParamTypes.string("Option 6"),
  radio6Secondary: ParamTypes.string("Secondary Label 6"),
  radio7: ParamTypes.string("Option 7"),
  radio7Secondary: ParamTypes.string("Secondary Label 7"),
  radio8: ParamTypes.string("Option 8"),
  radio8Secondary: ParamTypes.string("Secondary Label 8"),
  radio9: ParamTypes.string("Option 9"),
  radio9Secondary: ParamTypes.string("Secondary Label 9"),
  radio10: ParamTypes.string("Option 10"),
  radio10Secondary: ParamTypes.string("Secondary Label 10"),
  radio11: ParamTypes.string("Option 11"),
  radio11Secondary: ParamTypes.string("Secondary Label 11"),
  labelColor: ParamTypes.string("Label Color", "black"),
  fontFamily: ParamTypes.stringUndefined("Font Family"),
  fontSize: ParamTypes.string("Font Size", "18pt"),
  labelAlignment: ParamTypes.oneOf(
    "Label Alignment",
    ["above", "below"],
    "below"
  ),
  rows: ParamTypes.number("Number of Rows", 4),
};
