import PropTypes from "prop-types";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";

// Specify Configurable Parameters
const params = {
  radio1: ParamTypes.string("Option 1", "1"),
  radio1Secondary: ParamTypes.string("Secondary Label 1", "Low"),
  radio2: ParamTypes.string("Option 2", "2"),
  radio2Secondary: ParamTypes.string("Secondary Label 2"),
  radio3: ParamTypes.string("Option 3", "3"),
  radio3Secondary: ParamTypes.string("Secondary Label 3", "High"),
  radio4: ParamTypes.string("Option 4"),
  radio4Secondary: ParamTypes.string("Secondary Label 4"),
  radio5: ParamTypes.string("Option 5"),
  radio5Secondary: ParamTypes.string("Secondary Label 5"),
  radio6: ParamTypes.string("Option 6"),
  radio6Secondary: ParamTypes.string("Secondary Label 6"),
  radio7: ParamTypes.string("Option 7"),
  radio7Secondary: ParamTypes.string("Secondary Label 7"),
  barLeftMargin: ParamTypes.number("Bar Left Margin (%)", 10),
  barRightMargin: ParamTypes.number("Bar Right Margin (%)", 10),
  barTopMargin: ParamTypes.number("Bar Top Margin (%)", 50),
  barColor: ParamTypes.string("Bar Color", "black"),
  barThickness: ParamTypes.number("Bar Width (px)", 8),
  labelColor: ParamTypes.string("Label Color", "black"),
  fontFamily: ParamTypes.stringUndefined("Font Family"),
  fontSize: ParamTypes.string("Font Size", "18pt"),
  labelAlignment: ParamTypes.oneOf(
    "Label Alignment",
    ["above", "below"],
    "below"
  )
};

// Specify PropTypes for non-Configurable Props
const staticPropTypes = {
  initialIndex: PropTypes.number,
  initialValue: PropTypes.string
};

// Create merged propTypes, defaultProps
// for Configurable Parameters
// and non-Configurable Props
const { propTypes, defaultProps } = buildPropTypes(params, staticPropTypes);

export { params, propTypes, defaultProps };