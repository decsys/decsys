import { useEffect } from "react";
import { MultiVisualAnalogScale } from "@decsys/rating-scales/mvas";
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
  // Convert oneOf's to bools
  useConfidenceInput = useConfidenceInput === "Yes";
  const showUndoButton = ["Undo", "Both"].includes(buttons);
  const showResetButton = ["Reset", "Both"].includes(buttons);

  const handleMvasCompleted = (e) => {
    logResults({ value: e.detail });
    setNextEnabled(true);
  };

  useEffect(() => {
    document.addEventListener("MvasCompleted", handleMvasCompleted);
    return () =>
      document.removeEventListener("MvasCompleted", handleMvasCompleted);
  }, []);

  return (
    <MultiVisualAnalogScale
      buttons={{
        undo: showUndoButton,
        reset: showResetButton,
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
    />
  );
};

ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;
ResponseItem.stats = stats;

export default ResponseItem;
