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
} from "@chakra-ui/react";

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
  confidenceTextOptions,
  confidenceText,
}) => {
  leftMarkerOptions = { ...dragMarkerDefaults, ...leftMarkerOptions };
  rightMarkerOptions = { ...dragMarkerDefaults, ...rightMarkerOptions };
  centerMarkerOptions = { ...dragMarkerDefaults, ...centerMarkerOptions };

  // marker state
  const [markerPositioning, setMarkerPositioning] = useState({});
  const [markerBounds, setMarkerBounds] = useState({});
  const [markerX, setMarkerX] = useState({});

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
    if (outputs.confidence != null) dispatch("MvasCompleted");
  }, [outputs]);

  // mounting the bar / confuguring dom ref
  const [bar, setBar] = useState(null);
  const barRef = useCallback((bar) => {
    if (!bar) return;
    setBar(bar);

    // initialise the dragmarker now the bar is available
    const { width, x } = getBounds(bar);
    setMarkerPositioning({
      yAnchor: 0,
      xOffset: x,
    });

    // On Bar mount, set static bounds
    // and enable the left marker only
    setMarkerBounds({
      left: {
        xInit: width / 2,
        xMin: x, // this will always be true
        xMax: width + x,
      },
      right: {
        xMax: width + x, // this will always be true
      },
    });
  }, []);

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
    // no left marker position yet, nothing to do
    if (markerX.left == null) return;

    const { xOffset } = markerPositioning;

    // calculate relative z-index values
    const markerZ = { left: 0, right: 0, center: 0 };
    // we need to know
    // a) how many markers are within a sensible overlap range (for center priority)
    const nearPx = 20;
    if (markerX.center != null) {
      const isNear = (x1, x2) => Math.abs(x1 - x2) < nearPx;
      let count = +isNear(markerX.left, markerX.center);
      count += +isNear(markerX.right, markerX.center);

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

    setMarkerBounds({
      left: {
        baseZIndex: markerZ.left,
        xInit: markerBounds.left.xInit,
        xMin: markerBounds.left.xMin,
        xMax:
          // this one's annoying as the default (leftMax) already includes the offset
          // but the recorded x positions dont
          (markerX.center ?? markerX.right) != null
            ? (markerX.center ?? markerX.right) + xOffset
            : markerBounds.left.xMax,
      },
      right: {
        baseZIndex: markerZ.right,
        // left + (rightMax - left) / 2 - (offset / 2)
        xInit:
          markerX.left +
          (markerBounds.right.xMax - markerX.left) / 2 -
          xOffset / 2,
        xMin: (markerX.center ?? markerX.left) + xOffset,
        xMax: markerBounds.right.xMax,
      },
      center: {
        baseZIndex: markerZ.center,
        // left + (right - left) / 2
        xInit:
          markerX.right != null
            ? markerX.left + (markerX.right - markerX.left) / 2
            : undefined,
        xMin: markerX.left + xOffset,
        xMax: markerX.right + xOffset,
      },
    });
  }, [markerX, markerPositioning]);

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
    setOutputs({ ...outputs, [outputKey]: value });
  };

  const handleConfidenceChange = (value) => {
    value = Math.min(Math.max(value, 0), 100);
    setOutputs({
      ...outputs,
      confidence: value,
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
              {...markerPositioning}
              {...markerBounds.left}
              {...leftMarkerOptions}
              onDrop={handleMarkerDrop("left")}
            />
            <DragMarker
              {...markerPositioning}
              {...markerBounds.right}
              {...rightMarkerOptions}
              onDrop={handleMarkerDrop("right")}
            />
            <DragMarker
              {...markerPositioning}
              {...markerBounds.center}
              {...centerMarkerOptions}
              onDrop={handleMarkerDrop("center")}
            />
          </FlexContainer>
        </ScaleBar>

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
              isDisabled={outputs.bestEstimate == null}
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

  /** Options for the Reponse Confidence text */
  confidenceTextOptions: PropTypes.shape(questionPropTypes),

  /** Response Confidence text to display */
  confidenceText: PropTypes.string,
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
  confidenceText: "How confident are you?",
  confidenceTextOptions: {
    topMargin: "80%",
    xAlign: "center",
  },
};

export { MultiVisualAnalogScale };
