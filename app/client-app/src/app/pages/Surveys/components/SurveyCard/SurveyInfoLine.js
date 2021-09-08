import { useState } from "react";
import { Badge, Flex, Icon, Stack, Tooltip } from "@chakra-ui/react";
import NameInput from "components/shared/NameInput";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";
import { AiOutlineGroup } from "react-icons/ai";
import { RiSurveyLine } from "react-icons/ri";
import { RespondentCountBadge } from "./ActiveInstanceLine";

const SurveyInfoLine = ({
  id,
  name,
  runCount,
  type,
  parentSurveyId,
  hasInvalidExternalLink,
  isStudy,
  friendlyId,
}) => {
  const [nameState, setNameState] = useState({});
  const { saveName } = useSurveyCardActions();
  const handleNameSave = (value) => {
    saveName(id, value, setNameState);
  };

  return (
    <>
      <Tooltip hasArrow label={isStudy ? "Study" : "Survey"}>
        <Flex align="center" justifyContent="center">
          <Icon as={isStudy ? AiOutlineGroup : RiSurveyLine} />
        </Flex>
      </Tooltip>
      {!parentSurveyId && (
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
      {parentSurveyId && friendlyId && (
        <Stack direction="row" alignItems="center">
          <RespondentCountBadge friendlyId={friendlyId} />
        </Stack>
      )}
    </>
  );
};

export default SurveyInfoLine;
