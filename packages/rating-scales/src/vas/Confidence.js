import {
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import Frame from "../core/Frame";
import Question from "../core/Question";
import { Scale } from "./Scale";

export const confidenceInputStyles = {
  input: "input",
  scale: "scale",
};

const ConfidenceInput = ({ isDisabled, onChange = () => {}, value }) => (
  <InputGroup marginTop="100px" width="120px">
    <NumberInput
      isDisabled={isDisabled}
      min={0}
      max={100}
      onChange={onChange}
      value={value ?? ""}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
    <InputRightAddon children="%" />
  </InputGroup>
);

const ConfidenceScale = ({ isDisabled, onChange = () => {}, value }) => (
  <Scale
    barOptions={{
      minValue: 0,
      maxValue: 100,
      thickness: "0.2em",
      topMargin: "50%",
      barColor: isDisabled ? "#bbb" : undefined,
    }}
    labels={{ min: "0%", max: "100%" }}
    labelOptions={{
      labelColor: isDisabled ? "#bbb" : undefined,
    }}
    value={value}
    onChange={(v) => !isDisabled && onChange(v)}
    dragMarkerOptions={{
      label: value,
      color: isDisabled ? "#bbb" : undefined,
    }}
    isDisabled={isDisabled}
  />
);

export const Confidence = ({
  confidenceTextOptions,
  confidenceText,
  isDisabled,
  onChange = () => {},
  value,
  style = confidenceInputStyles.input,
}) => (
  <Frame frameHeight="200px">
    <Question {...confidenceTextOptions}>{confidenceText}</Question>
    {style === confidenceInputStyles.scale && (
      <ConfidenceScale
        isDisabled={isDisabled}
        value={value}
        onChange={(v) => onChange(parseInt(v))}
      />
    )}
    {style !== confidenceInputStyles.scale && (
      <div
        css={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ConfidenceInput
          isDisabled={isDisabled}
          value={value}
          onChange={onChange}
        />
      </div>
    )}
  </Frame>
);
