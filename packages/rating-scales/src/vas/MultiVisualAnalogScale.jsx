import { useState } from "react";
import { Frame } from "../core/Frame";
import { Question } from "../core/Question";
import { Scale } from "./MultiScale";
import { Confidence, confidenceInputStyles } from "./Confidence";
import { ResetButtons } from "./ResetButtons";
import { valueIds } from "./constants";
import { behaviours } from "./behaviours";

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

/**
 * State Hook for using a MultiVisualAnalogScale
 * @param {*} initialValues
 * @returns
 */
export const useMultiVisualAnalogScale = (initialValues = {}) => {
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
    thickness: "0.2em", //scaleBarDefaultProps.thickness,
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
          values={{
            left: values.left,
            right: values.right,
            center: values.bestEstimate,
          }}
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
          value={values.confidence}
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
          resetAll={
            buttons.resetAll && {
              onClick: handleResetAll,
              isDisabled: !resetStack.length,
            }
          }
        />
      )}
    </>
  );
};

export { MultiVisualAnalogScale };
