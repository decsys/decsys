import { useState } from "react";
import { Frame } from "../core/Frame";
import { Question } from "../core/Question";
import { Scale } from "./Scale";
import { Confidence } from "./Confidence";
import { valueIds } from "./constants";

/**
 * State Hook for using a VisualAnalogScale
 * @param {*} initialValue
 * @param {*} initialConfidence
 * @returns
 */
export const useVisualAnalogScale = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const onChange = (id, v, newValues) => setValues({ ...newValues, [id]: v });

  return {
    props: { values },
    handlers: { onChange },
    setValues,
  };
};

const VisualAnalogScale = ({
  frameHeight = "300px",
  questionOptions = {},
  question,
  barOptions,
  labels,
  labelOptions,
  scaleMarkerOptions,
  dragMarkerOptions,
  values = {},
  onChange = () => {},
  useConfidenceInput,
  confidenceText = "How confident are you?",
  confidenceTextOptions = { topMargin: "0%", xAlign: "center" },
}) => {
  const handleScaleChange = (value) => {
    onChange(valueIds.value, value, { ...values, [valueIds.value]: value });
  };

  const handleConfidenceChange = (value) => {
    value = Math.min(Math.max(value, 0), 100);
    onChange(valueIds.confidence, value, {
      ...values,
      [valueIds.confidence]: value,
    });
  };

  return (
    <>
      <Frame frameHeight={frameHeight}>
        <Question {...questionOptions}>{question}</Question>
        <Scale
          barOptions={barOptions}
          labels={labels}
          labelOptions={labelOptions}
          scaleMarkerOptions={scaleMarkerOptions}
          dragMarkerOptions={dragMarkerOptions}
          onChange={handleScaleChange}
          value={values.value}
        />
      </Frame>
      {useConfidenceInput && (
        <Confidence
          confidenceText={confidenceText}
          confidenceTextOptions={confidenceTextOptions}
          isDisabled={values.value == null}
          topMargin={frameHeight}
          onChange={handleConfidenceChange}
          value={values.confidence}
          style={useConfidenceInput}
        />
      )}
    </>
  );
};

export { VisualAnalogScale };
