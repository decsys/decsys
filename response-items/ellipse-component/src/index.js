import React from "react";
import PropTypes from "prop-types";
import paramTypes, { setParams } from "@decsys/param-types/";
import EllipseScale from "@decsys/rating-scales/lib/ellipse/Scale";
import { CircleNotch } from "styled-icons/fa-solid";

const Ellipse = ({
  barLeftMargin,
  barRightMargin,
  barTopMargin,
  barColor,
  barThickness,
  barMinValue,
  barMaxValue,
  labelColor,
  fontFamily,
  fontSize,
  labelAlignment,
  minLabel,
  midLabel,
  maxLabel,
  penColor,
  penThickness,
  minRangeValue,
  maxRangeValue,
  rangeMarkerColor,
  rangeMarkerLength,
  rangeMarkerThickness,
  scaleMarkerColor,
  scaleMarkerThickness,
  scaleMarkerLength,
  scaleSubdivisionColor,
  scaleSubdivisionThickness,
  scaleSubdivisionLength,
  scaleMarkers,
  scaleSubdivisions
}) => {
  return (
    <EllipseScale
      barOptions={{
        minValue: barMinValue,
        maxValue: barMaxValue,
        leftMargin: `${barLeftMargin}%`,
        rightMargin: `${barRightMargin}%`,
        topMargin: `${barTopMargin}%`,
        barColor,
        thickness: `${barThickness}px`
      }}
      penOptions={{
        color: penColor,
        thickness: penThickness
      }}
      labels={{
        min: minLabel,
        mid: midLabel,
        max: maxLabel
      }}
      labelOptions={{
        labelColor,
        fontFamily,
        fontSize,
        yAlign: labelAlignment
      }}
      rangeMarkerOptions={{
        markerColor: rangeMarkerColor,
        length: `${rangeMarkerLength}px`,
        thickness: `${rangeMarkerThickness}px`
      }}
      scaleMarkerOptions={{
        markerColor: scaleMarkerColor,
        thickness: `${scaleMarkerThickness}px`,
        length: `${scaleMarkerLength}px`,
        subColor: scaleSubdivisionColor,
        subThickness: `${scaleSubdivisionThickness}px`,
        subLength: `${scaleSubdivisionLength}px`,
        markers: scaleMarkers,
        subdivisions: scaleSubdivisions
      }}
      minRangeValue={minRangeValue}
      maxRangeValue={maxRangeValue}
      frameHeight="300px"
    />
  );
};

// propTypes and defaultProps for non-parameter props (e.g. results)
Ellipse.propTypes = {
  minRangeValue: PropTypes.number,
  maxRangeValue: PropTypes.number
};

//set parameter metadata, including propTypes and defaultProps
setParams(Ellipse, {
  barLeftMargin: paramTypes.number("Bar Left Margin (%)", 10),
  barRightMargin: paramTypes.number("Bar Right Margin (%)", 10),
  barTopMargin: paramTypes.number("Bar Top Margin (%)", 50),
  barColor: paramTypes.string("Bar Color", "black"),
  barThickness: paramTypes.number("Bar Thickness (px)", 8),
  barMinValue: paramTypes.number("Bar Min Value"),
  barMaxValue: paramTypes.number("Bar Max Value", 100),
  labelColor: paramTypes.string("Label Color", "black"),
  fontFamily: paramTypes.stringUndefined("Label Font Family"),
  fontSize: paramTypes.string("Label Font Size", "18pt"),
  labelAlignment: paramTypes.oneOf(
    "Label Vertical Alignment",
    ["above", "below"],
    "below"
  ),
  minLabel: paramTypes.string("Minimum Label", "Min"),
  midLabel: paramTypes.string("Middle Label"),
  maxLabel: paramTypes.string("Maximum Label", "Max"),
  penColor: paramTypes.string("Pen Color", "black"),
  penThickness: paramTypes.number("Pen Thickness", 2),
  rangeMarkerColor: paramTypes.string("Range Marker Color", "black"),
  rangeMarkerLength: paramTypes.number("Range Marker Length (px)", 100),
  rangeMarkerThickness: paramTypes.number("Range Marker Thickness (px)", 10),
  scaleMarkerColor: paramTypes.string("Scale Marker Color", "black"),
  scaleMarkerThickness: paramTypes.number("Scale Marker Thickness", 5),
  scaleMarkerLength: paramTypes.number("Scale Marker Length", 50),
  scaleSubdivisionColor: paramTypes.string("Scale Subdivision Color", "black"),
  scaleSubdivisionThickness: paramTypes.number(
    "Scale Subdivision Thickness",
    5
  ),
  scaleSubdivisionLength: paramTypes.number("Scale Subdivision Length", 20),
  scaleMarkers: paramTypes.number("Scale Markers", 2),
  scaleSubdivisions: paramTypes.number("Scale Subdivisions", 10)
});

// Metadata properties
Ellipse.version = "0.1.0";
Ellipse.icon = <CircleNotch />;

export default Ellipse;
