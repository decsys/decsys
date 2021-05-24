import { useEffect } from "react";
import { VisualAnalogScale } from "@decsys/rating-scales";
import * as props from "./ResponseItem.props";
import { stats } from "./ResponseItem.stats";

const ResponseItem = ({
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
  scaleMarkerColor,
  scaleMarkerThickness,
  scaleMarkerHeight,
  scaleSubdivisionColor,
  scaleSubdivisionThickness,
  scaleSubdivisionHeight,
  scaleMarkers,
  scaleSubdivisions,
  dragMarkerColor,
  dragMarkerInactiveColor,
  dragMarkerInteractColor,
  _context: { setNextEnabled, logResults },
}) => {
  const handleVasCompleted = (e) => {
    logResults({ value: e.detail });
    setNextEnabled(true);
  };

  useEffect(() => {
    document.addEventListener("VasCompleted", handleVasCompleted);
    return () =>
      document.removeEventListener("VasCompleted", handleVasCompleted);
  }, []);

  return (
    <VisualAnalogScale
      barOptions={{
        minValue: barMinValue,
        maxValue: barMaxValue,
        leftMargin: `${barLeftMargin}%`,
        rightMargin: `${barRightMargin}%`,
        topMargin: `${barTopMargin}%`,
        barColor,
        thickness: `${barThickness}px`,
      }}
      labels={{
        min: minLabel,
        mid: midLabel,
        max: maxLabel,
      }}
      labelOptions={{
        labelColor,
        fontFamily,
        fontSize,
        yAlign: labelAlignment,
      }}
      scaleMarkerOptions={{
        markerColor: scaleMarkerColor,
        thickness: `${scaleMarkerThickness}px`,
        length: `${scaleMarkerHeight}px`,
        subColor: scaleSubdivisionColor,
        subThickness: `${scaleSubdivisionThickness}px`,
        subLength: `${scaleSubdivisionHeight}px`,
        markers: scaleMarkers,
        subdivisions: scaleSubdivisions,
      }}
      dragMarkerOptions={{
        color: dragMarkerColor,
        inactiveColor: dragMarkerInactiveColor,
        interactColor: dragMarkerInteractColor,
      }}
      frameHeight="300px"
    />
  );
};

ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;
ResponseItem.stats = stats;

export default ResponseItem;
