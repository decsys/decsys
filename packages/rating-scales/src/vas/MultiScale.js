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
    document.dispatchEvent(
      new CustomEvent("MvasCompleted", { detail: outputs })
    );
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
    console.log(markerX);
    // no left marker position yet, nothing to do
    if (markerX.left == null) return;

    const { xOffset } = markerPositioning;

    setMarkerBounds({
      left: {
        xInit: markerBounds.left.xInit,
        xMin: markerBounds.left.xMin,
        xMax:
          // this one's annoying as the default (leftMax) already includes the offset
          // but the recorded x positions dont
          markerX.center ?? markerX.right != null
            ? (markerX.center ?? markerX.right) + xOffset
            : markerBounds.left.xMax,
      },
      right: {
        // left + (rightMax - left) / 2 - (offset / 2)
        xInit:
          markerX.left +
          (markerBounds.right.xMax - markerX.left) / 2 -
          xOffset / 2,
        xMin: (markerX.center ?? markerX.left) + xOffset,
        xMax: markerBounds.right.xMax,
      },
      center: {
        // left + (right - left) / 2
        xInit:
          markerX.right != null
            ? markerX.left + (markerX.right - markerX.left) / 2
            : undefined,
        xMin: markerX.left + xOffset,
        xMax: markerX.right + xOffset,
      },
    });
  }, [markerX]);

  const handleMarkerDrop = (markerId) => (barRelativeX) => {
    const value = getValueForRelativeX(
      barRelativeX,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );

    setMarkerX({ ...markerX, [markerId]: barRelativeX });
    setOutputs({ ...outputs, [`${markerId}Value`]: value });
  };

  const handleConfidenceChange = (value) => {
    value = Math.min(Math.max(value, 0), 100);
    setOutputs({
      ...outputs,
      confidencePercentage: value,
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
              isDisabled={outputs.centerValue == null}
              min={0}
              max={100}
              onChange={handleConfidenceChange}
              value={outputs.confidencePercentage ?? ""}
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
    /** Color of the marker when incative (i.e. before ANY dragging has occurred, if no default value) */
    inactiveColor: PropTypes.string,

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
  dragMarkerOptions: {},
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
