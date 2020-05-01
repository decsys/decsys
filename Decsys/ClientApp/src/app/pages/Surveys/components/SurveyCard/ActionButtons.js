import React, { createElement } from "react";
import { Button, Text } from "@chakra-ui/core";
import { Link } from "@reach/router";
import { listMatchingKeys } from "services/data-structures";
import { FaTimesCircle, FaRocket } from "react-icons/fa";

const buttons = {
  launch: ({ onLaunch }) => (
    <Button
      lineHeight="inherit"
      variantColor="green"
      leftIcon={FaRocket}
      onClick={onLaunch}
    >
      Launch
    </Button>
  ),
  close: ({ onClose }) => (
    <Button
      lineHeight="inherit"
      variantColor="red"
      leftIcon={FaTimesCircle}
      onClick={onClose}
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

export const getActionButtons = ({
  activeInstanceId,
  allowLaunch,
  runCount
}) => ({
  close: !!activeInstanceId,
  dashboard: !!activeInstanceId,
  launch: !activeInstanceId,
  results: runCount > 0
});

const ActionButtons = ({ actionButtons, ...p }) =>
  listMatchingKeys(actionButtons).map(key =>
    createElement(buttons[key], { key, ...p })
  );

export default ActionButtons;
