import { useEffect } from "react";
import EllipseScale from "@decsys/rating-scales/cjs/ellipse";
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
  penColor,
  penThickness,
  minRangeValue,
  maxRangeValue,
  rangeMarkerColor,
  rangeMarkerHeight,
  rangeMarkerThickness,
  scaleMarkerColor,
  scaleMarkerThickness,
  scaleMarkerHeight,
  scaleSubdivisionColor,
  scaleSubdivisionThickness,
  scaleSubdivisionHeight,
  scaleMarkers,
  scaleSubdivisions,
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

ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;
ResponseItem.stats = stats;

export default ResponseItem;
