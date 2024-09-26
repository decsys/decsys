import {
  Flex,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  HStack,
  RangeSliderMark,
  Text,
} from "@chakra-ui/react";
import { RadioCard } from "./RadioCard";

export const RadioOptions = ({ group, getRadioProps, options, label }) => {
  return (
    <HStack {...group}>
      <Text>{label}:</Text>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
};

export const TypeFilter = (props) => {
  const typeOptions = ["Adjective", "Noun", "Custom Word", "All"];
  return <RadioOptions {...props} options={typeOptions} label="Type" />;
};

export const ExclusionFilter = (props) => {
  const exclusionState = ["Excluded", "Included", "All"];
  return <RadioOptions {...props} options={exclusionState} label="State" />;
};

export const WordLengthFilter = ({ sliderValues, handleSliderChange }) => {
  return (
    <HStack pt={4}>
      <Text>Word Length:</Text>
      <Flex pl="2" width="300px">
        <RangeSlider
          id="word-length"
          defaultValue={[1, 15]}
          min={1}
          max={15}
          step={1}
          onChange={handleSliderChange}
          value={sliderValues}
        >
          <RangeSliderMark
            value={sliderValues[0]}
            textAlign="center"
            mt="-30px"
            ml="-6px"
          >
            {sliderValues[0]}
          </RangeSliderMark>
          <RangeSliderMark
            value={sliderValues[1]}
            textAlign="center"
            mt="-30px"
            ml="-6px"
          >
            {sliderValues[1]}
          </RangeSliderMark>
          <RangeSliderTrack bg="blue.100">
            <RangeSliderFilledTrack bg="blue.500" />
          </RangeSliderTrack>
          <RangeSliderThumb boxSize={4} index={0} />
          <RangeSliderThumb boxSize={4} index={1} />
        </RangeSlider>
      </Flex>
    </HStack>
  );
};
