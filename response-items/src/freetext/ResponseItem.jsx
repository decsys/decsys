import { useState, useEffect } from "react";
import { params } from "./ResponseItem.params";
import { stats } from "./ResponseItem.stats";
import {
  Flex,
  Badge,
  Textarea,
  Text,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

const colorSchemes = {
  info: "blue",
  danger: "red",
  warning: "yellow",
};

// Build a React component for our FreeText question type
const ResponseItem = ({
  maxLength,
  text,
  regex,
  _context: { logResults, setIsValidResponse, clearResult },
}) => {
  const threshold = maxLength / 10; // right now we fix this at 10% MaxLength

  const [badgeVariant, setBadgeVariant] = useState("info");
  const [value, setValue] = useState(text);
  const [regexValue, setRegexValue] = useState(regex);
  const [isRegexValid, setIsRegexValid] = useState(true);

  useEffect(() => {
    setValue(text);
    setRegexValue(regex);
  }, [text, regex]);

  const handleRegex = (regex, text) => {
    const re = new RegExp(regex);
    return re.test(text);
  };

  const handleInput = ({ target }) => {
    const newValue = target.value;
    setValue(newValue);
    const inputLength = newValue.length;

    const count = maxLength - inputLength;
    if (count === 0) {
      setBadgeVariant("danger");
    } else if (count <= threshold) {
      setBadgeVariant("warning");
    } else {
      setBadgeVariant("info");
    }

    const regexIsValid = handleRegex(regexValue, newValue);
    setIsRegexValid(regexIsValid);

    if (inputLength === 0) {
      clearResult();
      setIsValidResponse(false);
    } else {
      setIsValidResponse(regexIsValid);
    }
  };

  const handleBlur = (e) => {
    e.persist();
    logResults({ text: e.target.value });
  };

  return (
    <FormControl isInvalid={!isRegexValid}>
      <Flex direction="column">
        <Flex p=".1em">
          <Badge display="flex" p={1} colorScheme={colorSchemes[badgeVariant]}>
            <Text mr={1}>Characters remaining:</Text>
            <Text>
              {maxLength - (value?.length ?? 0)}/{maxLength}
            </Text>
          </Badge>
        </Flex>
        <Textarea
          value={value}
          maxLength={maxLength}
          name="FreeText"
          onChange={handleInput}
          onBlur={handleBlur}
        />
        {!isRegexValid && (
          <FormErrorMessage>
            <Text>Ensure all required criteria are met</Text>
          </FormErrorMessage>
        )}
      </Flex>
    </FormControl>
  );
};

ResponseItem.params = params;
ResponseItem.stats = stats;

export default ResponseItem;
