import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Flex, Text, Button, Input, Textarea, Stack } from "@chakra-ui/core";
import { generateCombination } from "gfycat-style-urls";
import produce from "immer";

const ParticipantIdentifiersConfig = ({ data, mutate }) => {
  const [idGenCount, setIdGenCount] = useState(10);
  const handleGenCountChange = ({ target: { value } }) =>
    setIdGenCount(parseInt(value));

  const handleIdGenClick = () =>
    mutate(
      produce(config => {
        config.validIdentifiers.push(
          ...Array(idGenCount)
            .fill(() => generateCombination(1, "", true))
            .map(x => x())
        );
      }),
      false
    );

  return (
    <>
      <Text fontWeight="bold" mt={1}>
        Valid Participant Identifiers
      </Text>

      <Flex alignItems="center" my={1} ml={2}>
        <Flex as={FaInfoCircle} fontSize="5em" color="cyan.500" />
        <Flex flexDirection="column" ml={2}>
          <Text color="cyan.500">
            • Restrict Survey access to only these Identifiers
          </Text>
          <Text color="cyan.500">• One Identifier per line</Text>
          <Text color="cyan.500">
            • Leave empty to require participants to enter a unique identifier
          </Text>
        </Flex>
      </Flex>

      <Stack isInline my={2}>
        <Flex>
          <Input
            size="sm"
            type="number"
            value={idGenCount}
            onChange={handleGenCountChange}
          />
        </Flex>
        <Button size="sm" variantColor="gray" onClick={handleIdGenClick}>
          Generate Random IDs
        </Button>
      </Stack>

      <Textarea
        height="inherit"
        rows="6"
        value={data.validIdentifiers.join("\n")}
        onChange={({ target: { value } }) =>
          mutate({ ...data, validIdentifiers: value.split("\n") }, false)
        }
      />
    </>
  );
};

export default ParticipantIdentifiersConfig;
