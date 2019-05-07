import React, { useEffect } from "react";
import { EllipseScale } from "@decsys/rating-scales";
import * as props from "./Component.props";

const Component = ({
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
  scaleSubdivisions,
  setNextEnabled,
  logResults
}) => {
  const handleEllipseCompleted = e => {
    logResults(e.detail);
    setNextEnabled(true);
  };

  useEffect(() => {
    setNextEnabled(false);
    document.addEventListener("EllipseCompleted", handleEllipseCompleted);
    return () =>
      document.removeEventListener("EllipseCompleted", handleEllipseCompleted);
  }, []);

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

Component.params = props.params;
Component.propTypes = props.propTypes;
Component.defaultProps = props.defaultProps;

export default Component;
