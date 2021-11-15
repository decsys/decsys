// import PropTypes from "prop-types";
import ParamTypes, {
  buildPropTypes,
  renderContextPropTypes,
} from "@decsys/param-types";

// Specify Configurable Parameters
const params = {
  barLeftMargin: ParamTypes.number("Bar Left Margin (%)", 10),
  barRightMargin: ParamTypes.number("Bar Right Margin (%)", 10),
  barTopMargin: ParamTypes.number("Bar Top Margin (%)", 50),
  barColor: ParamTypes.string("Bar Color", "black"),
  barThickness: ParamTypes.number("Bar Thickness (px)", 4),
  barMinValue: ParamTypes.number("Bar Min Value"),
  barMaxValue: ParamTypes.number("Bar Max Value", 100),
  labelColor: ParamTypes.string("Label Color", "black"),
  fontFamily: ParamTypes.stringUndefined("Label Font Family"),
  fontSize: ParamTypes.string("Label Font Size", "18pt"),
  labelAlignment: ParamTypes.oneOf(
    "Label Vertical Alignment",
    ["above", "below"],
    "below"
  ),
  minLabel: ParamTypes.string("Minimum Label", "Min"),
  midLabel: ParamTypes.string("Middle Label"),
  maxLabel: ParamTypes.string("Maximum Label", "Max"),

  scaleMarkerColor: ParamTypes.string("Scale Marker Color", "black"),
  scaleMarkerThickness: ParamTypes.number("Scale Marker Thickness", 4),
  scaleMarkerHeight: ParamTypes.number("Scale Marker Height", 30),
  scaleSubdivisionColor: ParamTypes.string("Scale Subdivision Color", "black"),
  scaleSubdivisionThickness: ParamTypes.number(
    "Scale Subdivision Thickness",
    4
  ),
  scaleSubdivisionHeight: ParamTypes.number("Scale Subdivision Height", 15),
  scaleMarkers: ParamTypes.number("Scale Markers", 5),
  scaleSubdivisions: ParamTypes.number("Scale Subdivisions", 4),

  dragMarkerColor: ParamTypes.string("Drag Marker Color", "black"),
  dragMarkerInteractColor: ParamTypes.string(
    "Drag Marker Interaction Color",
    "#58d"
  ),
  dragMarkerInitDistance: ParamTypes.number(
    "Drag Marker Initial Distance from Bar (px)",
    20
  ),
  useConfidenceInput: ParamTypes.oneOf(
    "Confidence Input Style",
    ["None", "Input", "Scale"],
    "None"
  ),
  confidenceText: ParamTypes.string(
    "Confidence Input Text",
    "How confident are you?"
  ),
  confidenceTextColor: ParamTypes.string(
    "Confidence Input Text Color",
    "black"
  ),
  confidenceTextFontFamily: ParamTypes.stringUndefined(
    "Confidence Input Text Font Family"
  ),

  confidenceTextFontSize: ParamTypes.string(
    "Confidence Input Text Font Size",
    "18pt"
  ),
};

// Specify PropTypes for non-Configurable Props
const staticPropTypes = renderContextPropTypes;

// Create merged propTypes, defaultProps
// for Configurable Parameters
// and non-Configurable Props
const { propTypes, defaultProps } = buildPropTypes(params, staticPropTypes);

export { params, propTypes, defaultProps };
