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
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightAddon,
  Button,
  Stack,
} from "@chakra-ui/react";
import { behaviour as behaviourKeys, behaviours } from "./behaviours";

const DottedLine = ({ yAnchor, x1, x2 }) => {
  if (x1 == null || x2 == null) return null;

  return (
    <div
      css={{
        position: "absolute",
        top: `${yAnchor - 25}px`,
        left: x1,
        width: x2 - x1,
        borderTop: "dashed .2em gray",
      }}
    ></div>
  );
};

const generateMarkerKey = (markerId) => `${markerId}-${Date.now()}`;

const addToOutputsStack = (stack, value) => {
  const newStack = [...stack];
  if (newStack.every((x) => x !== value)) newStack.push(value);
  return newStack;
};

// TODO: Refactor, especially undo/reset
const MultiVisualAnalogScale = ({
  frameHeight,
  questionOptions,
  question,
  barOptions,
  labels: { min, mid, max },
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
}) => {
  leftMarkerOptions = { ...dragMarkerDefaults, ...leftMarkerOptions };
  rightMarkerOptions = { ...dragMarkerDefaults, ...rightMarkerOptions };
  centerMarkerOptions = { ...dragMarkerDefaults, ...centerMarkerOptions };

  // marker state
  const [markerPositioning, setMarkerPositioning] = useState({});
  const [markerBounds, setMarkerBounds] = useState({});
  const [markerX, setMarkerX] = useState({});

  // enabling reset/undo
  const [outputsStack, setOutputsStack] = useState([]);
  const [markerKeys, setMarkerKeys] = useState({
    left: generateMarkerKey("left"),
    right: generateMarkerKey("center"),
    center: generateMarkerKey("right"),
  });

  const behaviourProvider =
    behaviours[behaviour] ?? behaviours[behaviourKeys.SpeirsBridge2010];

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

  // mounting the bar / confuguring dom ref
  const [bar, setBar] = useState(null);
  const barRef = useCallback(
    (bar) => {
      if (!bar) return;
      setBar(bar);

      // initialise the dragmarker now the bar is available
      const barBounds = getBounds(bar);
      setMarkerPositioning({
        yAnchor: 0,
        xOffset: barBounds.x,
      });

      // On Bar mount, set initial bounds
      setMarkerBounds({
        left: {},
        right: {},
        center: {},
        ...behaviourProvider.initialMarkerBounds(barBounds),
      });
    },
    [behaviourProvider]
  );

  // bar labels
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

  // update marker bounds based on new marker x positions
  useEffect(() => {
    // if we don't have bounds state for ANY markers, quit
    if (
      (markerBounds.left ?? markerBounds.right ?? markerBounds.center) == null
    )
      return;

    console.log(markerBounds);

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
    if (markerX.left < markerBounds.left.xInit) {
      markerZ.left = 10;
      markerZ.right = 20;
    } else {
      markerZ.left = 20;
      markerZ.right = 10;
    }

    //update markerBounds state
    let newMarkerBounds = { ...markerBounds };

    // apply updated Z index
    newMarkerBounds.left.baseZIndex = markerZ.left;
    newMarkerBounds.right.baseZIndex = markerZ.right;
    newMarkerBounds.center.baseZIndex = markerZ.center;

    // apply behaviour updates
    newMarkerBounds = behaviourProvider.updateMarkerBounds(
      newMarkerBounds,
      markerX,
      markerPositioning
    );

    setMarkerBounds(newMarkerBounds);
  }, [markerX, markerPositioning, behaviourProvider]);

  const handleMarkerDrop = (markerId) => (barRelativeX) => {
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
    console.log(newStack);
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
    console.log(lastKey);

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
        setMarkerKeys({
          ...markerKeys,
          [lastKey]: generateMarkerKey(lastKey),
        });
      }
    }
    console.log(newStack);
    setOutputsStack(newStack);
  };

  const handleReset = () => {
    setOutputsStack([]);
    setOutputs({});
    setMarkerX({});
    setMarkerKeys({
      left: generateMarkerKey("left"),
      right: generateMarkerKey("right"),
      center: generateMarkerKey("center"),
    });
  };

  return (
    <>
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
              key={markerKeys.left}
              {...markerPositioning}
              {...markerBounds.left}
              {...leftMarkerOptions}
              onDrop={handleMarkerDrop("left")}
            />
            <DragMarker
              key={markerKeys.right}
              {...markerPositioning}
              {...markerBounds.right}
              {...rightMarkerOptions}
              onDrop={handleMarkerDrop("right")}
            />
            <DragMarker
              key={markerKeys.center}
              {...markerPositioning}
              {...markerBounds.center}
              {...centerMarkerOptions}
              onDrop={handleMarkerDrop("center")}
            />
            {behaviour === behaviours.HeskethPryorHesketh1988 && (
              <>
                <DottedLine
                  {...markerPositioning}
                  x1={markerX.left}
                  x2={markerX.center}
                />
                <DottedLine
                  {...markerPositioning}
                  x1={markerX.center}
                  x2={markerX.right}
                />
              </>
            )}
          </FlexContainer>
        </ScaleBar>

        {useConfidenceInput && (
          <>
            <Question {...confidenceTextOptions}>{confidenceText}</Question>
            <div
              css={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <InputGroup marginTop={frameHeight} width="120px">
                <NumberInput
                  isDisabled={
                    outputs.bestEstimate == null ||
                    outputs.left == null ||
                    outputs.right == null
                  }
                  min={0}
                  max={100}
                  onChange={handleConfidenceChange}
                  value={outputs.confidence ?? ""}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <InputRightAddon children="%" />
              </InputGroup>
            </div>
          </>
        )}
        <Stack direction="row" justify="center" mt={5}>
          <Button
            size="sm"
            disabled={!outputsStack.length}
            onClick={handleUndo}
          >
            Undo last
          </Button>
          <Button size="sm" onClick={handleReset}>
            Reset all
          </Button>
        </Stack>
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
};

export { MultiVisualAnalogScale };
