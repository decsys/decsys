import { useState, useEffect } from "react";
import { params } from "./ResponseItem.params";
import { stats } from "./ResponseItem.stats";
import { Flex, Badge, Textarea, Text } from "@chakra-ui/react";

const colorSchemes = {
  info: "blue",
  danger: "red",
  warning: "yellow",
};

// Build a React component for our FreeText question type
const ResponseItem = ({
  maxLength,
  text,
  _context: { logResults, setIsValidResponse, clearResult },
}) => {
  const threshold = maxLength / 10; // right now we fix this at 10% MaxLength

  const [badgeVariant, setBadgeVariant] = useState("info");
  const [value, setValue] = useState(text);
  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleInput = ({ target }) => {
    setValue(target.value);
    const inputLength = target.value.length;

    if (inputLength === 0) {
      clearResult();
    }
    setIsValidResponse(true);

    const count = maxLength - inputLength;
    if (count === 0) {
      setBadgeVariant("danger");
    } else if (count <= threshold) {
      setBadgeVariant("warning");
    } else {
      setBadgeVariant("info");
    }
  };

  const handleBlur = (e) => {
    e.persist();
    logResults({ text: e.target.value });
  };

  return (
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
    </Flex>
  );
};

ResponseItem.params = params;
ResponseItem.stats = stats;

export default ResponseItem;
