import { useState, useCallback, useEffect } from "react";
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
import { behaviour as behaviourKeys, behaviours } from "./behaviours";
import { ResetButtons } from "./ResetButtons";
import { Confidence } from "./Confidence";

const DottedLine = ({ baseY, x1, x2 }) => {
  if (x1 == null || x2 == null) return null;

  return (
    <div
      css={{
        position: "absolute",
        top: `${baseY - 25}px`,
        left: x1,
        width: x2 - x1,
        borderTop: "dashed .2em gray",
      }}
    ></div>
  );
};

const addToOutputsStack = (stack, value) => {
  const newStack = [...stack];
  if (newStack.every((x) => x !== value)) newStack.push(value);
  return newStack;
};

const getBehaviourProvider = (behaviour) =>
  behaviours[behaviour] ?? behaviours[behaviourKeys.SpeirsBridge2010];

const ScaleLabels = ({ labels: { min, mid, max } = {}, labelOptions }) => {
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
  return <FlexContainer>{labels}</FlexContainer>;
};

export const Scale = ({
  behaviour,
  labels = {},
  labelOptions = {},
  barOptions = {
    minValue: 0,
    maxValue: 100,
    // we depend on this one for calculations
    thickness: scaleBarDefaultProps.thickness,
  },
  scaleMarkerOptions = {},
  leftMarkerOptions = {},
  rightMarkerOptions = {},
  centerMarkerOptions = {},
  onChange = () => {},
}) => {
  console.log(behaviour);
  const [markerState, setMarkerState] = useState({
    shared: {},
    left: {},
    right: {},
    center: {},
  });

  // mounting the bar / configuring dom ref
  const [bar, setBar] = useState(null);
  const barRef = useCallback(
    // TODO: controlled values
    (bar) => {
      if (!bar) return;
      setBar(bar);
      console.log(behaviour, bar);

      // initialise the dragmarker now the bar is available
      const barBounds = getBounds(bar);
      setMarkerState({
        shared: {
          baseY: 0,
          baseX: barBounds.x,
        },
        left: {},
        right: {},
        center: {},
        ...getBehaviourProvider(behaviour).getInitialState(barBounds),
      });
    },
    [behaviour]
  );

  const handleMarkerDrop = (markerId) => (x) => {
    const { width } = getBounds(bar);

    setMarkerState((old) =>
      getBehaviourProvider(behaviour).getUpdatedState(
        {
          ...old,
          [markerId]: { ...old[markerId], x, isActivated: true },
        },
        width
      )
    );

    const value = getValueForRelativeX(
      x,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );

    onChange(markerId, value);
  };

  return (
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
      <ScaleLabels labels={labels} labelOptions={labelOptions} />
      <FlexContainer>
        <DragMarker
          {...markerState.shared}
          {...markerState.left}
          {...leftMarkerOptions}
          onDrop={handleMarkerDrop("left")}
        />
        <DragMarker
          {...markerState.shared}
          {...markerState.right}
          {...rightMarkerOptions}
          onDrop={handleMarkerDrop("right")}
        />
        <DragMarker
          {...markerState.shared}
          {...markerState.center}
          {...centerMarkerOptions}
          onDrop={handleMarkerDrop("center")}
        />
        {behaviour === behaviourKeys.HeskethPryorHesketh1988 && (
          <>
            <DottedLine
              {...markerState.shared}
              x1={markerState.left.x}
              x2={markerState.center.x}
            />
            <DottedLine
              {...markerState.shared}
              x1={markerState.center.x}
              x2={markerState.right.x}
            />
          </>
        )}
      </FlexContainer>
    </ScaleBar>
  );
};

// TODO: Refactor, especially undo/reset
const MultiVisualAnalogScale = ({
  frameHeight,
  questionOptions,
  question,
  barOptions,
  labels,
  labelOptions,
  scaleMarkerOptions,
  dragMarkerDefaults,
  leftMarkerOptions = {},
  rightMarkerOptions = {},
  centerMarkerOptions = {},
  useConfidenceInput,
  confidenceTextOptions,
  confidenceText,
  behaviour,
  buttons,
}) => {
  leftMarkerOptions = { ...dragMarkerDefaults, ...leftMarkerOptions };
  rightMarkerOptions = { ...dragMarkerDefaults, ...rightMarkerOptions };
  centerMarkerOptions = { ...dragMarkerDefaults, ...centerMarkerOptions };

  // enabling reset/undo
  const [outputsStack, setOutputsStack] = useState([]);

  const [outputs, setOutputs] = useState({});
  useEffect(() => {
    const dispatch = (eventName) =>
      document.dispatchEvent(
        new CustomEvent(eventName, {
          detail: outputs,
        })
      );

    // Outputs updated
    dispatch("MvasUpdated");

    // If the last output to be entered has a value
    // we can consider the response "completed"
    if (useConfidenceInput) {
      if (outputs.confidence != null) dispatch("MvasCompleted");
    } else if (
      outputs.left != null &&
      outputs.right != null &&
      outputs.bestEstimate != null
    ) {
      dispatch("MvasCompleted");
    }
  }, [outputs, useConfidenceInput]);

  // bar labels

  // update marker bounds based on new marker x positions
  useEffect(() => {
    if (!bar) return;
    const { width } = getBounds(bar);
    // if we don't have bounds state for ANY markers, quit
    if (
      (markerBounds.left ?? markerBounds.right ?? markerBounds.center) == null
    )
      return;

    // calculate relative z-index values // TODO: maybe behaviour in future?
    const markerZ = { left: 0, right: 0, center: 0 };
    // we need to know
    // a) how many markers are within a sensible overlap range (for center priority)
    const nearPx = 20;
    if (markerX.center != null) {
      const isNear = (x1, x2) => Math.abs(x1 - x2) < nearPx;
      let count = +(
        markerX.left != null && isNear(markerX.left, markerX.center)
      );
      count += +(
        markerX.right != null && isNear(markerX.right, markerX.center)
      );

      // if there's 1 marker nearby, center goes on top, so it can be moved away even at axis extremes
      // otherwise center goes at bottom, as it either makes no difference, or L/R are more important
      markerZ.center = count === 1 ? 50 : 0;
    }
    // b) if left marker is in the left or right half of the scale (for L/R priority)
    // we do this irrespective of closeness of markers
    // since it makes no difference at distance,
    // but is correct if any are close
    if (markerX.left < width / 2) {
      markerZ.left = 10;
      markerZ.right = 20;
    } else {
      markerZ.left = 20;
      markerZ.right = 10;
    }

    //update markerBounds state
    let newMarkerBounds = { ...markerBounds };

    // apply updated Z index
    newMarkerBounds.left.baseZ = markerZ.left;
    newMarkerBounds.right.baseZ = markerZ.right;
    newMarkerBounds.center.baseZ = markerZ.center;

    // apply behaviour updates
    newMarkerBounds = getBehaviourProvider(behaviour).updateMarkerBounds(
      newMarkerBounds,
      markerX,
      markerPositioning
    );

    setMarkerBounds(newMarkerBounds);
  }, [markerX, markerPositioning, behaviour, bar]);

  const handleMarkerDrop = (markerId) => (barRelativeX) => {
    // TODO: markerX is dumb, can we do the updates in here instead of useEffect()?
    const value = getValueForRelativeX(
      barRelativeX,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );

    setMarkerX({ ...markerX, [markerId]: barRelativeX });
    const outputKey = {
      left: "left",
      right: "right",
      center: "bestEstimate",
    }[markerId];
    const newStack = addToOutputsStack(outputsStack, outputKey);
    setOutputsStack(newStack);
    setOutputs({ ...outputs, [outputKey]: value });
  };

  const handleConfidenceChange = (value) => {
    value = Math.min(Math.max(value, 0), 100);
    setOutputsStack(addToOutputsStack(outputsStack, "confidence"));
    setOutputs({
      ...outputs,
      confidence: value,
    });
  };

  const handleUndo = () => {
    const newStack = [...outputsStack];
    let lastKey = newStack.pop();

    if (lastKey) {
      // clear the recorded output
      setOutputs({
        ...outputs,
        [lastKey]: undefined,
      });
      if (lastKey !== "confidence") {
        if (lastKey === "bestEstimate") lastKey = "center";
        // if we're undoing a marker, clear its x pos
        setMarkerX({
          ...markerX,
          [lastKey]: undefined,
        });
      }
    }
    setOutputsStack(newStack);
  };

  const handleReset = () => {
    setOutputsStack([]);
    setOutputs({});
    setMarkerX({});
  };

  return (
    <>
      <Frame frameHeight={frameHeight}>
        <Question {...questionOptions}>{question}</Question>
        <Scale
          barOptions={barOptions}
          scaleMarkerOptions={scaleMarkerOptions}
          labels={labels}
          labelOptions={labelOptions}
          leftMarkerOptions={leftMarkerOptions}
          rightMarkerOptions={rightMarkerOptions}
          centerMarkerOptions={centerMarkerOptions}
        />

        {useConfidenceInput && (
          <Confidence
            confidenceText={confidenceText}
            confidenceTextOptions={confidenceTextOptions}
            isDisabled={
              outputs.bestEstimate == null ||
              outputs.left == null ||
              outputs.right == null
            }
            frameHeight={frameHeight}
            onChange={handleConfidenceChange}
            value={outputs.confidence}
          />
        )}
        {(buttons.resetAll || buttons.resetLast) && (
          <ResetButtons
            resetLast={
              buttons.resetLast && {
                onClick: handleUndo,
                isDisabled: !outputsStack.length,
              }
            }
            resetAll={{
              onClick: handleReset,
              isDisabled: !outputsStack.length,
            }}
          />
        )}
      </Frame>
    </>
  );
};

const dragMarkerOptionsPropTypes = PropTypes.shape(
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
);

MultiVisualAnalogScale.propTypes = {
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

  /** Default options for all Drag Markers */
  dragMarkerDefaults: dragMarkerOptionsPropTypes,

  /** Options for Left Drag Marker */
  leftMarkerOptions: dragMarkerOptionsPropTypes,

  /** Options for Right Drag Marker */
  rightMarkerOptions: dragMarkerOptionsPropTypes,

  /** Options for Center Drag Marker */
  centerMarkerOptions: dragMarkerOptionsPropTypes,

  /** Whether to ask for a Confidence response */
  useConfidenceInput: PropTypes.bool,

  /** Options for the Reponse Confidence text */
  confidenceTextOptions: PropTypes.shape(questionPropTypes),

  /** Response Confidence text to display */
  confidenceText: PropTypes.string,

  /** Select a preset behaviour */
  behaviour: PropTypes.string,

  /** Display buttons */
  buttons: PropTypes.shape({
    rseetLast: PropTypes.bool,
    resetAll: PropTypes.bool,
  }),
};

MultiVisualAnalogScale.defaultProps = {
  frameHeight: "300px",
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
  dragMarkerDefaults: {},
  leftMarkerOptions: { label: "L" },
  rightMarkerOptions: { label: "R" },
  centerMarkerOptions: { label: "C" },
  useConfidenceInput: true,
  confidenceText: "How confident are you?",
  confidenceTextOptions: {
    topMargin: "80%",
    xAlign: "center",
  },
  behaviour: behaviours.SpeirsBridge2010,
  buttons: {},
};

export { MultiVisualAnalogScale };
