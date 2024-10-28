import ParamTypes from "@decsys/param-types";

// Specify Configurable Parameters
export const params = {
  rows: ParamTypes.number("Number of Rows", 3),
  row1Label: ParamTypes.string("Row 1", "Row 1"),
  row2Label: ParamTypes.string("Row 2", "Row 2"),
  row3Label: ParamTypes.string("Row 3", "Row 3"),
  row4Label: ParamTypes.string("Row 4"),
  row5Label: ParamTypes.string("Row 5"),
  row6Label: ParamTypes.string("Row 6"),
  row7Label: ParamTypes.string("Row 7"),
  row8Label: ParamTypes.string("Row 8"),
  row9Label: ParamTypes.string("Row 9"),
  row10Label: ParamTypes.string("Row 10"),
  row11Label: ParamTypes.string("Row 11"),
  fontWeight: ParamTypes.oneOf(
    "Row Option Font Weight",
    ["normal", "bold", "bolder", "lighter"],
    "normal"
  ),
  radio1: ParamTypes.string("Column 1", "1"),
  radio2: ParamTypes.string("Column 2", "2"),
  radio3: ParamTypes.string("Column 3", "3"),
  radio4: ParamTypes.string("Column 4", "4"),
  radio5: ParamTypes.string("Column 5"),
  radio6: ParamTypes.string("Column 6"),
  radio7: ParamTypes.string("Column 7"),
  radio8: ParamTypes.string("Column 8"),
  radio9: ParamTypes.string("Column 9"),
  radio10: ParamTypes.string("Column 10"),
  radio11: ParamTypes.string("Column 11"),
  labelColor: ParamTypes.string("Label Color", "black"),
  fontFamily: ParamTypes.stringUndefined("Font Family"),
  fontSize: ParamTypes.string("Font Size", "18pt"),
  width: ParamTypes.number("Width of Row Label", 100),
};
