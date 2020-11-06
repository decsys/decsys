import ParamTypes from "@decsys/param-types";

// Specify Configurable Parameters
export const paramTypes = {
  barLeftMargin: ParamTypes.integer({
    label: "Bar Left Margin (%)",
    default: 10,
  }),
  barRightMargin: ParamTypes.integer({
    label: "Bar Right Margin (%)",
    default: 10,
  }),
  barTopMargin: ParamTypes.integer({
    label: "Bar Top Margin (%)",
    default: 50,
  }),
  barColor: ParamTypes.color({ label: "Bar Color", default: "black" }),
  barThickness: ParamTypes.integer({ label: "Bar Thickness (px)", default: 4 }),
  barMinValue: ParamTypes.integer({ label: "Bar Min default: Value" }),
  barMaxValue: ParamTypes.integer({ label: "Bar Max Value", default: 100 }),
  labelColor: ParamTypes.color({ label: "Label Color", default: "black" }),
  fontFamily: ParamTypes.string(
    { label: "Label Font Family" },
    { defaultUndefined: true }
  ),
  fontSize: ParamTypes.string({ label: "Label Font Size", default: "18pt" }),
  labelAlignment: ParamTypes.oneOf(["above", "below"], {
    label: "Label Vertical Alignment",
    default: "below",
  }),
  minLabel: ParamTypes.string({ label: "Minimum Label", default: "Min" }),
  midLabel: ParamTypes.string({ label: "Middle Label" }),
  maxLabel: ParamTypes.string({ label: "Maximum Label", default: "Max" }),
  penColor: ParamTypes.color({ label: "Pen Color", default: "red" }),
  penThickness: ParamTypes.integer({ label: "Pen Thickness", default: 2 }),
  rangeMarkerColor: ParamTypes.color("Range Marker Color", "blue"),
  rangeMarkerHeight: ParamTypes.integer({
    label: "Range Marker Height (px)",
    default: 100,
  }),
  rangeMarkerThickness: ParamTypes.integer({
    label: "Range Marker Thickness (px)",
    default: 6,
  }),
  scaleMarkerColor: ParamTypes.color({
    label: "Scale Marker Color",
    default: "black",
  }),
  scaleMarkerThickness: ParamTypes.integer({
    label: "Scale Marker Thickness",
    default: 4,
  }),
  scaleMarkerHeight: ParamTypes.integer({
    label: "Scale Marker Height",
    default: 30,
  }),
  scaleSubdivisionColor: ParamTypes.color({
    label: "Scale Subdivision Color",
    default: "black",
  }),
  scaleSubdivisionThickness: ParamTypes.integer({
    label: "Scale Subdivision Thickness",
    default: 4,
  }),
  scaleSubdivisionHeight: ParamTypes.integer({
    label: "Scale Subdivision Height",
    default: 15,
  }),
  scaleMarkers: ParamTypes.integer({ label: "Scale Markers", default: 5 }),
  scaleSubdivisions: ParamTypes.integer({
    label: "Scale Subdivisions",
    default: 4,
  }),
};
