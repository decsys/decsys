import { useEffect } from "react";
import {
  VisualAnalogScale,
  useVisualAnalogScale,
} from "@decsys/rating-scales/vas";
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
  dragMarkerInteractColor,
  dragMarkerInitDistance,
  useConfidenceInput,
  confidenceText,
  confidenceTextColor,
  confidenceTextFontFamily,
  confidenceTextFontSize,
  _context: { setNextEnabled, logResults },
}) => {
  // remap some param values to expected prop values
  useConfidenceInput =
    useConfidenceInput &&
    (useConfidenceInput === "None"
      ? false
      : useConfidenceInput.toLocaleLowerCase());

  const { props: vasProps, handlers: vasHandlers } = useVisualAnalogScale();

  useEffect(() => {
    // only log on "completions"
    // and only consider complete when the "last" expected input has a value
    // which is either scale or confidence, depending if confidence is being captured.
    const isComplete = useConfidenceInput
      ? vasProps.values.confidence != null
      : vasProps.values.scale != null;

    if (isComplete) {
      logResults(vasProps.values);
      setNextEnabled(true);
    }
  }, [vasProps.values, logResults, setNextEnabled, useConfidenceInput]);

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
        interactColor: dragMarkerInteractColor,
        yInitDistance: dragMarkerInitDistance,
      }}
      frameHeight="300px"
      useConfidenceInput={useConfidenceInput}
      confidenceText={confidenceText}
      confidenceTextOptions={{
        topMargin: "0%",
        xAlign: "center",
        fontFamily: confidenceTextFontFamily,
        fontSize: confidenceTextFontSize,
        textColor: confidenceTextColor,
      }}
      {...vasProps}
      {...vasHandlers}
    />
  );
};

ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;
ResponseItem.stats = stats;

export default ResponseItem;
