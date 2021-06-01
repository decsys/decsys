import { useState } from "react";
import { Badge, Flex } from "@chakra-ui/react";
import NameInput from "components/shared/NameInput";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";

const SurveyInfoLine = ({ id, name, runCount, type }) => {
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
          colorScheme={!!type ? "yellow" : "cyan"}
          variant="solid"
          py={1}
        >
          {!!type ? type.toUpperCase() : `${runCount} runs`}
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
