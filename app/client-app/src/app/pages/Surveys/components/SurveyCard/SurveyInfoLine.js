import { useState } from "react";
import { Badge, Flex } from "@chakra-ui/react";
import NameInput from "components/shared/NameInput";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";

const SurveyInfoLine = ({
  id,
  name,
  runCount,
  type,
  parent,
  hasInvalidExternalLink,
}) => {
  const [nameState, setNameState] = useState({});
  const { saveName } = useSurveyCardActions();
  const handleNameSave = (value) => {
    saveName(id, value, setNameState);
  };

  return (
    <>
      {!parent && (
        <Flex align="center" justifyContent="center">
          <Badge
            w="100%"
            textAlign="center"
            colorScheme={
              !!type ? (hasInvalidExternalLink ? "red" : "yellow") : "cyan"
            }
            variant="solid"
            py={1}
            title={
              hasInvalidExternalLink
                ? "Another DECSYS Survey has the same type and external ID."
                : ""
            }
          >
            {!!type ? type.toUpperCase() : `${runCount} runs`}
          </Badge>
        </Flex>
      )}

      <Flex align="center">
        <NameInput
          name={name}
          handleNameSave={handleNameSave}
          nameState={nameState}
          size="sm"
        />
      </Flex>
    </>
  );
};

export default SurveyInfoLine;
