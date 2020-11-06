import { useEffect } from "react";
import EllipseScale from "@decsys/rating-scales/cjs/ellipse";
import { paramTypes } from "./ResponseItem.paramTypes";
import PropTypes from "prop-types";
import { renderContextPropTypes } from "@decsys/param-types";
import { stats } from "./ResponseItem.stats";
import { buildPropTypes } from "@decsys/param-types";

const dummyProps = {
  bar: {
    margins: {
      left: 10,
      right: 10,
      top: 50,
    },
    color: "black",
    thickness: 4,
    minValue: 0,
    maxValue: 100,
  },
  labels: {
    min: "",
    mid: "",
    max: "",
    options: {
      color: "black",
      fontFamily: "Arial",
      fontSize: "18pt",
      yAlign: "above",
    },
  },
  pen: {
    color: "red",
    thickness: 2,
  },
  rangeMarkers: {
    color: "blue",
    thickness: 6,
    height: 100,
  },
  scaleMarkers: {
    n: 5,
    color: "black",
    thickness: 4,
    height: 30,
    subdivisions: {
      n: 4,
      color: "black",
      thickness: 4,
      height: 15,
    },
  },
};

const ResponseItem = ({
  barLeftMargin = 10,
  barRightMargin = 10,
  barTopMargin = 50,
  barColor = "black",
  barThickness = 4,
  barMinValue = 0,
  barMaxValue = 100,
  labelColor = "black",
  fontSize = "18pt",
  labelAlignment = "below",
  minLabel = "Min",
  maxLabel = "Max",
  penColor = "red",
  penThickness = 2,
  rangeMarkerColor = "blue",
  rangeMarkerHeight = 100,
  rangeMarkerThickness = 6,
  scaleMarkerColor = "black",
  scaleMarkerThickness = 4,
  scaleMarkerHeight = 30,
  scaleSubdivisionColor = "black",
  scaleSubdivisionThickness = 4,
  scaleSubdivisionHeight = 15,
  scaleMarkers = 5,
  scaleSubdivisions = 4,
  midLabel,
  fontFamily,
  minRangeValue,
  maxRangeValue,
  _context: { setNextEnabled, logResults },
}) => {
  const handleEllipseCompleted = (e) => {
    logResults(e.detail);
    setNextEnabled(true);
  };

  useEffect(() => {
    document.addEventListener("EllipseCompleted", handleEllipseCompleted);
    return () =>
      document.removeEventListener("EllipseCompleted", handleEllipseCompleted);
  }, []); // eslint-disable-line

  return (
    <EllipseScale
      barOptions={{
        minValue: barMinValue,
        maxValue: barMaxValue,
        leftMargin: `${barLeftMargin}%`,
        rightMargin: `${barRightMargin}%`,
        topMargin: `${barTopMargin}%`,
        barColor,
        thickness: `${barThickness}px`,
      }}
      penOptions={{
        color: penColor,
        thickness: penThickness,
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
      rangeMarkerOptions={{
        markerColor: rangeMarkerColor,
        length: `${rangeMarkerHeight}px`,
        thickness: `${rangeMarkerThickness}px`,
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
      minRangeValue={minRangeValue}
      maxRangeValue={maxRangeValue}
      frameHeight="300px"
    />
  );
};

ResponseItem.paramTypes = paramTypes;
ResponseItem.propTypes = {
  ...buildPropTypes(ResponseItem.paramTypes),
  ...renderContextPropTypes,
  minRangeValue: PropTypes.number,
  maxRangeValue: PropTypes.number,
};
ResponseItem.defaultProps = {};
ResponseItem.stats = stats;

export default ResponseItem;
