import { createElement } from "react";
import { Button, Text, useDisclosure } from "@chakra-ui/react";
import { Link } from "@reach/router";
import { listMatchingKeys } from "services/data-structures";
import { FaTimesCircle, FaRocket, FaPlay, FaPause } from "react-icons/fa";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";
import { ExternalDetailsModal } from "../ExternalDetailsModal";

const buttons = {
  launch: ({ type, runCount, handleLaunch, parentSurveyId }) => {
    const isResume = type && runCount > 0;
    return (
      <Button
        lineHeight="inherit"
        colorScheme="green"
        leftIcon={isResume ? <FaPlay /> : <FaRocket />}
        onClick={handleLaunch}
        size={parentSurveyId ? "sm" : "md"}
      >
        {isResume ? "Resume" : "Launch"}
      </Button>
    );
  },
  close: ({ type, handleClose, parentSurveyId }) => (
    <Button
      lineHeight="inherit"
      colorScheme="red"
      leftIcon={type ? <FaPause /> : <FaTimesCircle />}
      onClick={handleClose}
      size={parentSurveyId ? "sm" : "md"}
    >
      <Text>{type ? "Pause" : "Close"}</Text>
    </Button>
  ),
  dashboard: ({ friendlyId, parentSurveyId }) => (
    <Button
      lineHeight="inherit"
      colorScheme="green"
      as={Link}
      to={`/admin/surveys/dashboard/${friendlyId}`}
      size={parentSurveyId ? "sm" : "md"}
    >
      Dashboard
    </Button>
  ),
  results: ({ id, parentSurveyId }) => (
    <Button
      lineHeight="inherit"
      colorScheme="cyan"
      as={Link}
      to={`/admin/surveys/${id}/results`}
      size={parentSurveyId ? "sm" : "md"}
    >
      Results
    </Button>
  ),
  settings: ({ onExternalDetailsOpen }) => (
    <Button
      lineHeight="inherit"
      colorScheme="orange"
      onClick={onExternalDetailsOpen}
    >
      Finish Setup
    </Button>
  ),
};

export const getActionButtons = (
  { activeInstanceId, runCount, parentSurveyId, isStudy },
  areSettingsValid,
  currentArchiveDate
) => ({
  close: !parentSurveyId && !!activeInstanceId,
  dashboard: !isStudy && !!activeInstanceId,
  launch:
    !parentSurveyId &&
    !activeInstanceId &&
    areSettingsValid &&
    !currentArchiveDate,
  results: !isStudy && runCount > 0,
  settings: !parentSurveyId && !areSettingsValid,
});

const ActionButtons = (p) => {
  const { launch, close } = useSurveyCardActions();
  const handleLaunch = () => launch(p.id);
  const handleClose = () => close(p.id, p.activeInstanceId);
  const externalDetailsModal = useDisclosure();

  return (
    <>
      {listMatchingKeys(p.actionButtons).map((key) =>
        createElement(buttons[key], {
          ...p,
          handleLaunch,
          handleClose,
          onExternalDetailsOpen: externalDetailsModal.onOpen,
          key,
        })
      )}

      <ExternalDetailsModal
        id={p.id}
        name={p.name}
        type={p.type}
        settings={p.settings}
        runCount={p.runCount}
        hasInvalidExternalLink={p.hasInvalidExternalLink}
        modalState={externalDetailsModal}
      />
    </>
  );
};

export default ActionButtons;
