import { useState } from "react";
import {
  Badge,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import NameInput from "components/shared/NameInput";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";
import { AiOutlineGroup } from "react-icons/ai";
import { RiSurveyLine } from "react-icons/ri";
import { RespondentCountBadge } from "./ActiveInstanceLine";

const InfoBadge = ({
  type = "Folder",
  runCount,
  areSettingsValid,
  hasInvalidExternalLink,
}) => {
  let tooltip;
  const badgeProps = {
    w: "100%",
    textAlign: "center",
    variant: "solid",
    py: 1,
  };

  // No Type? Show Run Count
  if (!type) {
    badgeProps.colorScheme = "cyan";
    badgeProps.children = `${runCount} runs`;
  } else if (type === "Folder") {
    badgeProps.children = `0 Surveys`;
  } else {
    // Invalid External Link Error
    if (hasInvalidExternalLink) {
      badgeProps.colorScheme = "red";
      tooltip = "Another DECSYS Survey has the same type and external ID.";
    } else if (!areSettingsValid) {
      badgeProps.colorScheme = "red";
      tooltip = (
        <Flex textAlign="center">
          Settings are incomplete or invalid. This must be resolved before
          launching.
        </Flex>
      );
    } else {
      badgeProps.colorScheme = "yellow";
    }
    badgeProps.children = type.toUpperCase();
  }

  return (
    <Flex align="center" justifyContent="center">
      {tooltip ? (
        <Tooltip hasArrow label={tooltip}>
          <Badge {...badgeProps} />
        </Tooltip>
      ) : (
        <Badge {...badgeProps} />
      )}
    </Flex>
  );
};

const SurveyInfoLine = ({
  id,
  name,
  runCount,
  type,
  parentSurveyId,
  activeInstanceParticipantCount,
  hasInvalidExternalLink,
  isStudy,
  friendlyId,
  areSettingsValid,
  isFolder,
  folder,
}) => {
  const [nameState, setNameState] = useState({});
  const { saveName } = useSurveyCardActions();
  const handleNameSave = (value) => {
    saveName(id, value, setNameState);
  };

  return (
    <>
      <Tooltip hasArrow label={isFolder ? "" : isStudy ? "Study" : "Survey"}>
        {!isFolder ? (
          <Flex align="center" justifyContent="center">
            <Icon as={isStudy ? AiOutlineGroup : RiSurveyLine} />
          </Flex>
        ) : (
          <Flex></Flex>
        )}
      </Tooltip>
      {!parentSurveyId && (
        <InfoBadge
          runCount={runCount}
          type={type}
          hasInvalidExternalLink={hasInvalidExternalLink}
          areSettingsValid={areSettingsValid}
        />
      )}

      <Flex align="center">
        {isFolder ? (
          <Text fontSize="1.3rem" fontWeight="normal">
            {folder.name}
          </Text>
        ) : (
          <NameInput
            name={name}
            handleNameSave={handleNameSave}
            nameState={nameState}
            size="sm"
          />
        )}
      </Flex>
      {parentSurveyId && friendlyId && (
        <Stack direction="row" alignItems="center">
          <RespondentCountBadge count={activeInstanceParticipantCount} />
        </Stack>
      )}
    </>
  );
};

export default SurveyInfoLine;
