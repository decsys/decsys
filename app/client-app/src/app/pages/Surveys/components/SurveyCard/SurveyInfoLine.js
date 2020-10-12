import React, { useState } from "react";
import { Badge, Flex } from "@chakra-ui/core";
import NameInput from "components/shared/NameInput";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";

const SurveyInfoLine = ({ id, name, runCount }) => {
  const [nameState, setNameState] = useState({});
  const { saveName } = useSurveyCardActions();
  const handleNameSave = (value) => {
    saveName(id, value, setNameState);
  };

  return (
    <>
      <Flex align="center" justifyContent="center">
        <Badge
          w="100%"
          textAlign="center"
          colorScheme="cyan"
          variant="solid"
          py={1}
        >
          {runCount} runs
        </Badge>
      </Flex>

      <Flex align="center">
        <NameInput
          name={name}
          handleNameSave={handleNameSave}
          nameState={nameState}
        />
      </Flex>
    </>
  );
};

export default SurveyInfoLine;
