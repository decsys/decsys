import {
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import Question from "../core/Question";

export const Confidence = ({
  confidenceTextOptions,
  confidenceText,
  frameHeight,
  isDisabled,
  onChange = () => {},
  value,
}) => (
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
    </div>
  </>
);
