import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import UnitValue from "unit-value/lib/unit-value";
import Frame from "../core/Frame";
import Question, { questionPropTypes } from "../core/Question";
import {
  FlexContainer,
  ScaleBar,
  scaleBarDefaultProps,
  scaleBarPropTypes,
} from "../core/ScaleBar";
import ScaleLabel, { scaleLabelPropTypes } from "../core/ScaleLabel";
import {
  ScaleMarkerSet,
  scaleMarkerSetPropTypes,
} from "../core/ScaleMarkerSet";
import { getBounds, getValueForRelativeX } from "../core/services/bar-coords";
import { DragMarker } from "./DragMarker";

const VisualAnalogScale = ({
  frameHeight,
  questionOptions,
  question,
  barOptions,
  labels: { min, mid, max },
  labelOptions,
  scaleMarkerOptions,
  dragMarkerOptions,
}) => {
  const [markerState, setMarkerState] = useState({});

  const [bar, setBar] = useState(null);
  const barRef = useCallback((bar) => {
    if (!bar) return;
    setBar(bar);

    // initialise the dragmarker now the bar is available
    const { width, x } = getBounds(bar);
    setMarkerState({
      x: width / 2,
      baseX: x,
      baseY: 0,
      xMin: x,
      xMax: width + x,
      isActivated: false,
    });
  }, []);

  const labels = [];
  const labelValues = [min, mid, max];
  for (let i = 0; i < labelValues.length; i++) {
    labels.push(
      <ScaleLabel
        key={i}
        labelIndex={i}
        {...{ ...labelOptions, yAlign: "below" }} // fix labels to below as the marker is above
        value={labelValues[i]}
      />
    );
  }

  const handleMarkerDrop = (x) => {
    setMarkerState((old) => ({ ...old, x, isActivated: true }));
    const value = getValueForRelativeX(
      x,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );
    document.dispatchEvent(new CustomEvent("VasCompleted", { detail: value }));
  };

  return (
    <Frame frameHeight={frameHeight}>
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
        <FlexContainer>
          <DragMarker
            {...markerState}
            {...dragMarkerOptions}
            onDrop={handleMarkerDrop}
          />
        </FlexContainer>
      </ScaleBar>
    </Frame>
  );
};

VisualAnalogScale.propTypes = {
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

  /** Options for the Drag Marker */
  dragMarkerOptions: PropTypes.shape(
    // we don't use all of DragMarker's props; some are calculated
    {
      /** Color of the marker to show interaction (hover/dragging) */
      interactColor: PropTypes.string,

      /** Color of the marker at rest, when no other more specific color applies */
      color: PropTypes.string,

      /** distance from yAnchor (px) the marker starts at */
      yInitDistance: PropTypes.number,

      /** a text label for the marker, recommended no longer than 3 characters */
      label: PropTypes.string,

      /** Color for the marker label, if any is given */
      labelColor: PropTypes.string,
    }
  ),
};

VisualAnalogScale.defaultProps = {
  questionOptions: {},
  barOptions: {
    minValue: 0,
    maxValue: 100,
    // we depend on this one for calculations
    thickness: scaleBarDefaultProps.thickness,
  },
  labelOptions: {},
  labels: {},
  scaleMarkerOptions: {},
  dragMarkerOptions: {},
};

export { VisualAnalogScale };
