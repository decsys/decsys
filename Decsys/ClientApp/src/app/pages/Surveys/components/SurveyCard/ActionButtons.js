import React, { createElement } from "react";
import { Button, Text } from "@chakra-ui/core";
import { Link } from "@reach/router";
import { listMatchingKeys } from "services/data-structures";
import { FaTimesCircle, FaRocket } from "react-icons/fa";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";

const buttons = {
  launch: ({ handleLaunch }) => (
    <Button
      lineHeight="inherit"
      variantColor="green"
      leftIcon={FaRocket}
      onClick={handleLaunch}
    >
      Launch
    </Button>
  ),
  close: ({ handleClose }) => (
    <Button
      lineHeight="inherit"
      variantColor="red"
      leftIcon={FaTimesCircle}
      onClick={handleClose}
    >
      <Text>Close</Text>
    </Button>
  ),
  dashboard: ({ friendlyId }) => (
    <Button
      lineHeight="inherit"
      variantColor="green"
      as={Link}
      to={`/admin/survey/dashboard/${friendlyId}`}
    >
      Dashboard
    </Button>
  ),
  results: ({ id }) => (
    <Button
      lineHeight="inherit"
      variantColor="cyan"
      as={Link}
      to={`/admin/survey/${id}/results`}
    >
      Results
    </Button>
  )
};

export const getActionButtons = ({ activeInstanceId, runCount }) => ({
  close: !!activeInstanceId,
  dashboard: !!activeInstanceId,
  launch: !activeInstanceId,
  results: runCount > 0
});

const ActionButtons = ({ actionButtons, id, activeInstanceId }) => {
  const { launch, close } = useSurveyCardActions();
  const handleLaunch = () => launch(id);
  const handleClose = () => close(id, activeInstanceId);

  return listMatchingKeys(actionButtons).map(key =>
    createElement(buttons[key], { key, handleLaunch, handleClose })
  );
};

export default ActionButtons;
