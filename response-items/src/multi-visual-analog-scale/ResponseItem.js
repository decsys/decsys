import { useEffect } from "react";
import {
  MultiVisualAnalogScale,
  useMultiVisualAnalogScale,
} from "@decsys/rating-scales/mvas";
import * as props from "./ResponseItem.props";
import { stats } from "./ResponseItem.stats";

export const behaviourKeyMap = {
  "Speirs-Bridge 2010": "SpeirsBridge2010",
  "Hesketh, Pryor & Hesketh 1988": "HeskethPryorHesketh1988",
};

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
  dragMarkerInteractColor,
  dragMarkerInitDistance,
  leftDragMarkerColor,
  leftDragMarkerLabel,
  rightDragMarkerColor,
  rightDragMarkerLabel,
  centerDragMarkerColor,
  centerDragMarkerLabel,
  useConfidenceInput,
  confidenceText,
  confidenceTextColor,
  confidenceTextFontFamily,
  confidenceTextFontSize,
  behaviour,
  buttons,
  _context: { setNextEnabled, logResults },
}) => {
  // Convert params to expected prop values
  useConfidenceInput =
    useConfidenceInput &&
    (useConfidenceInput === "None"
      ? false
      : useConfidenceInput === true
      ? "input"
      : useConfidenceInput.toLocaleLowerCase());
  const showResetLastButton = ["Undo", "Reset Last", "Both"].includes(buttons);
  const showResetAllButton = ["Reset", "Reset All", "Both"].includes(buttons);

  const { props: mvasProps, handlers: mvasHandlers } =
    useMultiVisualAnalogScale();

  useEffect(() => {
    // only log on "completions"
    // and only consider complete when the "last" expected input has a value
    // which is either scale or confidence, depending if confidence is being captured.
    const isComplete = useConfidenceInput
      ? mvasProps.values.confidence != null
      : ["left", "right", "bestEstimate"].every(
          (valueId) => mvasProps.values[valueId] != null
        );

    if (isComplete) {
      logResults(mvasProps.values);
      setNextEnabled(true);
    }
  }, [mvasProps.values, useConfidenceInput, logResults, setNextEnabled]);

  return (
    <MultiVisualAnalogScale
      buttons={{
        resetLast: showResetLastButton,
        resetAll: showResetAllButton,
      }}
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
      dragMarkerDefaults={{
        interactColor: dragMarkerInteractColor,
        yInitDistance: dragMarkerInitDistance,
      }}
      leftMarkerOptions={{
        label: leftDragMarkerLabel,
        color: leftDragMarkerColor,
      }}
      rightMarkerOptions={{
        label: rightDragMarkerLabel,
        color: rightDragMarkerColor,
      }}
      centerMarkerOptions={{
        label: centerDragMarkerLabel,
        color: centerDragMarkerColor,
      }}
      useConfidenceInput={useConfidenceInput}
      confidenceText={confidenceText}
      confidenceTextOptions={{
        topMargin: "0%",
        xAlign: "center",
        fontFamily: confidenceTextFontFamily,
        fontSize: confidenceTextFontSize,
        textColor: confidenceTextColor,
      }}
      frameHeight="300px"
      behaviour={behaviourKeyMap[behaviour]}
      {...mvasProps}
      {...mvasHandlers}
    />
  );
};

ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;
ResponseItem.stats = stats;

export default ResponseItem;
