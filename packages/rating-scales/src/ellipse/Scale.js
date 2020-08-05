import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import EllipseCanvas, { ellipseCanvasPropTypes } from "./Canvas";
import Frame, { framePropTypes } from "../core/Frame";
import Question, { questionPropTypes } from "../core/Question";
import ScaleBar, {
  scaleBarPropTypes,
  FlexContainer,
  scaleBarDefaultProps,
} from "../core/ScaleBar";
import ScaleLabel, { scaleLabelPropTypes } from "./ScaleLabel";
import ScaleMarkerSet, {
  scaleMarkerSetPropTypes,
  scaleMarkerPropTypes,
  RangeMarker,
} from "./ScaleMarkerSet";
import UnitValue from "unit-value";
import {
  getBounds,
  getScrolledY,
  getValueForX,
  getXPosForValue,
  getRelativeXPos,
} from "./services/bar-coords";
import { findIntersections } from "./services/collision";

/**
 * Takes input values or absolute X co-ordinates
 * and returns both values and relative X co-ordinates.
 *
 * @param {*} inMin Range Minimum input
 * @param {*} inMax Range Maximum input
 * @param {*} min Minimum possible value
 * @param {*} max Maximum possible value
 * @param {*} isValue are the inputs raw values?
 * if `false` they are absolute x co-ordinates
 */
const convertRange = (inMin, inMax, min, max, bar, isValue = false) => {
  const vMin = isValue ? inMin : getValueForX(inMin, min, max, bar);
  const vMax = isValue ? inMax : getValueForX(inMax, min, max, bar);

  const xMin = isValue
    ? inMin != null
      ? getXPosForValue(inMin, min, max, bar)
      : inMin
    : getRelativeXPos(inMin, bar);
  const xMax = isValue
    ? inMax != null
      ? getXPosForValue(inMax, min, max, bar)
      : inMax
    : getRelativeXPos(inMax, bar);

  return {
    values: { min: vMin, max: vMax },
    xPos: { min: xMin, max: xMax },
  };
};

/** An Ellipse Scale */
const EllipseScale = ({
  frameHeight,
  minRangeValue,
  maxRangeValue,
  penOptions,
  question,
  questionOptions,
  barOptions: { minValue, maxValue, ...barOptions },
  labelOptions,
  labels: { min, mid, max },
  scaleMarkerOptions,
  rangeMarkerOptions,
}) => {
  const [outputs, setOutputs] = useState({
    minRangeValue,
    maxRangeValue,
    completed: false,
  });

  useEffect(() => {
    if (outputs.completed)
      document.dispatchEvent(
        new CustomEvent("EllipseCompleted", { detail: outputs })
      );
  }, [outputs]);

  // these are bar relative x co-ords
  const [minMarkerX, setMinMarkerX] = useState();
  const [maxMarkerX, setMaxMarkerX] = useState();

  // keep dom stuff we need
  // typically for dimensions
  const [bar, setBar] = useState();
  const barRef = useCallback((bar) => {
    if (!bar) return;
    setBar(bar);
    const {
      xPos: { min, max },
    } = convertRange(
      minRangeValue,
      maxRangeValue,
      minValue,
      maxValue,
      bar,
      true
    );

    setMinMarkerX(min);
    setMaxMarkerX(max);
  }, []);
  const canvasRef = useRef();

  const handleEllipseCompleted = ({ points, completed }) => {
    const { x, y, width } = getBounds(bar);

    const { top, left } = canvasRef.current.canvas.getBoundingClientRect();
    let hits = findIntersections(getScrolledY(y) - getScrolledY(top), points);

    // validate the PenLine hits
    if (hits.length !== 1) {
      // offset hits here so we don't clamp wrong
      hits = hits.map((x) => x + left);

      // 1 hit is valid outside the line
      //multiple hits have can't all be the same side
      const allLeft = hits.every((hit) => hit < x);
      const allRight = hits.every((hit) => hit > x + width);
      if (allLeft || allRight) {
        canvasRef.current.clear();
        return;
      }
    }

    // update state if a complete ellipse drawn:
    // get min, max x hits
    const min = Math.min(...hits);
    const max = Math.max(...hits);

    // Convert and apply them
    const { values, xPos } = convertRange(min, max, minValue, maxValue, bar);

    setMinMarkerX(xPos.min);
    setMaxMarkerX(xPos.max);

    setOutputs({
      minRangeValue: values.min,
      maxRangeValue: values.max,
      completed,
    });
  };

  const labels = [];
  const labelValues = [min, mid, max];
  for (let i = 0; i < labelValues.length; i++) {
    labels.push(
      <ScaleLabel
        key={i}
        labelIndex={i}
        {...labelOptions}
        value={labelValues[i]}
      />
    );
  }

  // same props for both bars
  const rangeMarkerProps = {
    thickness: barOptions.thickness,
    length: UnitValue.multiply(barOptions.thickness, 1.5).toString(),
    ...rangeMarkerOptions,
  };

  return (
    <Frame frameHeight={frameHeight}>
      <EllipseCanvas
        ref={canvasRef}
        {...penOptions}
        onCompleted={handleEllipseCompleted}
      />
      <Question {...questionOptions}>{question}</Question>
      <ScaleBar ref={barRef} {...barOptions}>
        <FlexContainer>
          <ScaleMarkerSet
            {...{
              // we compute some scale marker defaults
              // if not explicitly provided
              thickness: barOptions.thickness,
              length: UnitValue.multiply(barOptions.thickness, 8).toString(),
              ...scaleMarkerOptions,
            }}
          />
        </FlexContainer>
        <FlexContainer>{labels}</FlexContainer>
        <RangeMarker position={minMarkerX} {...rangeMarkerProps} />
        <RangeMarker position={maxMarkerX} {...rangeMarkerProps} />
      </ScaleBar>
    </Frame>
  );
};
EllipseScale.propTypes = {
  ...framePropTypes,

  /** Initial minimum range value */
  minRangeValue: PropTypes.number,

  /** Initial maximum range value */
  maxRangeValue: PropTypes.number,

  /** Options for the Pen Line appearance */
  penOptions: PropTypes.shape(ellipseCanvasPropTypes),

  /** Options for the scale's question text */
  questionOptions: PropTypes.shape(questionPropTypes),

  /** Question text to display */
  question: PropTypes.string,

  /** Options for the scale's horizontal bar */
  barOptions: PropTypes.shape({
    ...scaleBarPropTypes,
    /**
     * The numeric value of the left hand end of the range bar
     * (the minimum possible value of the range)
     */
    minValue: PropTypes.number.isRequired,
    /**
     * The numeric value of the right hand end of the range bar
     * (the maximum possible value of the range)
     */
    maxValue: PropTypes.number.isRequired,
  }),

  /** Options for the range bar's fixed labels */
  labelOptions: PropTypes.shape(
    // sadly we don't use all of ScaleLabel's props
    // ugh the doc comments aren't inherited either?
    // TODO: better api docs
    {
      labelColor: scaleLabelPropTypes.labelColor,
      fontFamily: scaleLabelPropTypes.fontFamily,
      fontSize: scaleLabelPropTypes.fontSize,
      yAlign: scaleLabelPropTypes.yAlign,
    }
  ),

  /** Fixed label values for the range bar */
  labels: PropTypes.shape({
    /** Label value for the left hand end */
    min: PropTypes.string,
    /** Central label value */
    mid: PropTypes.string,
    /** Label value for the right hand end */
    max: PropTypes.string,
  }),

  /** Options for the Scale Markers */
  scaleMarkerOptions: PropTypes.shape(scaleMarkerSetPropTypes),

  /** Options for the Range Markers appearance */
  rangeMarkerOptions: PropTypes.shape(scaleMarkerPropTypes),
};

// we basically default all the object props to empty
// to avoid needing nullish checks ;)
EllipseScale.defaultProps = {
  penOptions: {},
  questionOptions: {},
  barOptions: {
    minValue: 0,
    maxValue: 100,
    // we depend on this one for calculations
    thickness: scaleBarDefaultProps.thickness,
  },
  labelOptions: {},
  labels: {},
  rangeMarkerOptions: {},
  scaleMarkerOptions: {},
};

export default EllipseScale;
