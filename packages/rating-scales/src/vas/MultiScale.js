import { useState, useCallback, useEffect } from "react";
import UnitValue from "unit-value/lib/unit-value";
import Frame from "../core/Frame";
import Question from "../core/Question";
import {
  FlexContainer,
  ScaleBar,
  scaleBarDefaultProps,
} from "../core/ScaleBar";
import ScaleLabel from "../core/ScaleLabel";
import { ScaleMarkerSet } from "../core/ScaleMarkerSet";
import {
  getBounds,
  getValueForRelativeX,
  getXPosForValue,
} from "../core/services/bar-coords";
import { DragMarker } from "./DragMarker";
import { behaviour as behaviourKeys, behaviours } from "./behaviours";
import { ResetButtons } from "./ResetButtons";
import { Confidence, confidenceInputStyles } from "./Confidence";

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

/**
 * Ensure we only add a value to the stack once,
 * and only in the originally added order
 * e.g. behaviour order for drag markers
 * @param {*} stack the current stack
 * @param {*} value the value to add
 * @returns a new copy of the stack, with the added value if appropriate
 */
const addToResetStack = (stack, value) => {
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
  values = {},
  onChange = () => {},
}) => {
  const [markerState, setMarkerState] = useState({
    shared: {},
    left: {},
    right: {},
    center: {},
  });

  // mounting the bar / configuring dom ref
  // update marker state in response to prop changes (notably controlled values)
  const [bar, setBar] = useState(null);
  const barRef = useCallback(
    (bar) => {
      if (!bar) return;
      setBar(bar);

      // initialise the dragmarker now the bar is available
      const barBounds = getBounds(bar);

      // initialise state, including based on behaviour
      const initialMarkerState = {
        shared: {
          baseY: 0,
          baseX: barBounds.x,
        },
        left: {},
        right: {},
        center: {},
        ...getBehaviourProvider(behaviour).getInitialState(barBounds),
      };

      // add values if any are set
      const getMarkerX = (value, fallback) =>
        value != null
          ? getXPosForValue(
              value,
              barOptions.minValue,
              barOptions.maxValue,
              bar
            )
          : fallback;

      if (values?.left != null)
        initialMarkerState.left = {
          ...initialMarkerState.left,
          x: getMarkerX(values.left),
          isActivated: true,
        };
      if (values?.right != null)
        initialMarkerState.right = {
          ...initialMarkerState.right,
          x: getMarkerX(values.right),
          isActivated: true,
        };
      if (values?.center != null)
        initialMarkerState.center = {
          ...initialMarkerState.center,
          x: getMarkerX(values.center),
          isActivated: true,
        };

      // finally, set the initial state
      setMarkerState(
        getBehaviourProvider(behaviour).getUpdatedState(
          initialMarkerState,
          barBounds
        )
      );
    },
    [behaviour, values, barOptions.minValue, barOptions.maxValue]
  );

  const handleMarkerDrop = (markerId) => (x) => {
    const value = getValueForRelativeX(
      x,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );

    onChange(markerId, value, { ...values, [markerId]: value });
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

const valueIds = {
  center: "center",
  bestEstimate: "bestEstimate",
  confidence: "confidence",
};

/**
 * State Hook for using a MultiVisualAnalogScale
 * @param {*} initialValues
 * @returns
 */
export const useMultiVisualAnalogScale = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const onChange = (id, v, newValues) => setValues({ ...newValues, [id]: v });

  const onResetValue = (id) =>
    setValues((old) => ({ ...old, [id]: undefined }));

  const onResetAll = () => setValues({});

  return {
    props: { values },
    handlers: { onChange, onResetValue, onResetAll },
    setValues,
  };
};

const MultiVisualAnalogScale = ({
  frameHeight = "300px",
  questionOptions = {},
  barOptions = {
    minValue: 0,
    maxValue: 100,
    // we depend on this one for calculations
    thickness: scaleBarDefaultProps.thickness,
  },
  labelOptions = {},
  labels = {},
  scaleMarkerOptions = {},
  dragMarkerDefaults = {},
  leftMarkerOptions = { label: "L" },
  rightMarkerOptions = { label: "R" },
  centerMarkerOptions = { label: "C" },
  useConfidenceInput = confidenceInputStyles.input,
  confidenceText = "How confident are you?",
  confidenceTextOptions = { topMargin: "0%", xAlign: "center" },
  behaviour = behaviours.SpeirsBridge2010,
  buttons = {},
  question,
  values = {},
  onChange = () => {},
  onResetAll = () => {},
  onResetValue = () => {},
}) => {
  leftMarkerOptions = { ...dragMarkerDefaults, ...leftMarkerOptions };
  rightMarkerOptions = { ...dragMarkerDefaults, ...rightMarkerOptions };
  centerMarkerOptions = { ...dragMarkerDefaults, ...centerMarkerOptions };

  const [resetStack, setResetStack] = useState([]);
  const [scaleValues, setScaleValues] = useState({});
  const [confidenceValue, setConfidenceValue] = useState();

  useEffect(() => {
    const { left, right, bestEstimate, confidence } = values;
    setScaleValues({ left, right, center: bestEstimate });
    setConfidenceValue(confidence);
  }, [values]);

  const handleScaleChange = (markerId, newValue, newValues) => {
    // map output property names
    const outputId =
      markerId === valueIds.center ? valueIds.bestEstimate : markerId;

    setResetStack(addToResetStack(resetStack, outputId));

    const mergedValues = {
      ...values,
      ...newValues,
      bestEstimate:
        outputId === valueIds.bestEstimate ? newValue : newValues.center,
    };
    delete mergedValues.center;
    onChange(outputId, newValue, mergedValues);
  };

  const handleConfidenceChange = (value) => {
    value = Math.min(Math.max(value, 0), 100);
    setResetStack(addToResetStack(resetStack, valueIds.confidence));
    setConfidenceValue(value);
    onChange(valueIds.confidence, value, { ...values, confidence: value });
  };

  const handleResetLast = () => {
    const newStack = [...resetStack];
    let lastKey = newStack.pop();
    if (lastKey) {
      onResetValue(lastKey);
      setResetStack(newStack);
    }
  };

  const handleResetAll = () => {
    setResetStack([]);
    onResetAll();
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
          behaviour={behaviour}
          values={scaleValues}
          onChange={handleScaleChange}
        />
      </Frame>
      {useConfidenceInput && (
        <Confidence
          confidenceText={confidenceText}
          confidenceTextOptions={confidenceTextOptions}
          isDisabled={[values.left, values.right, values.bestEstimate].some(
            (x) => x == null
          )}
          topMargin={frameHeight}
          onChange={handleConfidenceChange}
          value={confidenceValue}
          style={useConfidenceInput}
        />
      )}
      {(buttons.resetAll || buttons.resetLast) && (
        <ResetButtons
          resetLast={
            buttons.resetLast && {
              onClick: handleResetLast,
              isDisabled: !resetStack.length,
            }
          }
          resetAll={{
            onClick: handleResetAll,
            isDisabled: !resetStack.length,
          }}
        />
      )}
    </>
  );
};

export { MultiVisualAnalogScale };
