import PropTypes from "prop-types";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";

// Specify Configurable Parameters
const params = {
  barLeftMargin: ParamTypes.number("Bar Left Margin (%)", 10),
  barRightMargin: ParamTypes.number("Bar Right Margin (%)", 10),
  barTopMargin: ParamTypes.number("Bar Top Margin (%)", 50),
  barColor: ParamTypes.string("Bar Color", "black"),
  barThickness: ParamTypes.number("Bar Thickness (px)", 8),
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
  penColor: ParamTypes.string("Pen Color", "black"),
  penThickness: ParamTypes.number("Pen Thickness", 2),
  rangeMarkerColor: ParamTypes.string("Range Marker Color", "black"),
  rangeMarkerLength: ParamTypes.number("Range Marker Length (px)", 100),
  rangeMarkerThickness: ParamTypes.number("Range Marker Thickness (px)", 10),
  scaleMarkerColor: ParamTypes.string("Scale Marker Color", "black"),
  scaleMarkerThickness: ParamTypes.number("Scale Marker Thickness", 5),
  scaleMarkerLength: ParamTypes.number("Scale Marker Length", 50),
  scaleSubdivisionColor: ParamTypes.string("Scale Subdivision Color", "black"),
  scaleSubdivisionThickness: ParamTypes.number(
    "Scale Subdivision Thickness",
    5
  ),
  scaleSubdivisionLength: ParamTypes.number("Scale Subdivision Length", 20),
  scaleMarkers: ParamTypes.number("Scale Markers", 2),
  scaleSubdivisions: ParamTypes.number("Scale Subdivisions", 10)
};

// Specify PropTypes for non-Configurable Props
const staticPropTypes = {
  minRangeValue: PropTypes.number,
  maxRangeValue: PropTypes.number
};

// Create merged propTypes, defaultProps
// for Configurable Parameters
// and non-Configurable Props
const { propTypes, defaultProps } = buildPropTypes(params, staticPropTypes);

export { params, propTypes, defaultProps };
