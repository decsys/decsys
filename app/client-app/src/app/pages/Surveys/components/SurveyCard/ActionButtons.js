import { createElement } from "react";
import { Button, Text } from "@chakra-ui/react";
import { Link } from "@reach/router";
import { listMatchingKeys } from "services/data-structures";
import { FaTimesCircle, FaRocket, FaPlay, FaPause } from "react-icons/fa";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";

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
      to={`/admin/survey/dashboard/${friendlyId}`}
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
      to={`/admin/survey/${id}/results`}
      size={parentSurveyId ? "sm" : "md"}
    >
      Results
    </Button>
  ),
};

export const getActionButtons = ({
  activeInstanceId,
  runCount,
  parentSurveyId,
  isStudy,
}) => ({
  close: !parentSurveyId && !!activeInstanceId,
  dashboard: !isStudy && !!activeInstanceId,
  launch: !parentSurveyId && !activeInstanceId,
  results: !isStudy && runCount > 0,
});

const ActionButtons = (p) => {
  const { launch, close } = useSurveyCardActions();
  const handleLaunch = () => launch(p.id);
  const handleClose = () => close(p.id, p.activeInstanceId);

  return listMatchingKeys(p.actionButtons).map((key) =>
    createElement(buttons[key], {
      ...p,
      handleLaunch,
      handleClose,
      key,
    })
  );
};

export default ActionButtons;
