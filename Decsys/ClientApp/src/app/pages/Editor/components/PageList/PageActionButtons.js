import React from "react";
import { Flex, Tooltip, Box, Text, useColorMode } from "@chakra-ui/core";
import {
  FaTrash,
  FaCopy,
  FaRandom,
  FaExclamationTriangle
} from "react-icons/fa";
import { DotHoverIconButton, ToggleButton } from "components/core";
import { usePageListActions } from "../../contexts/PageListActions";
import AddContentItemMenu from "./AddContentItemMenu";

const RandomTooltip = ({ isRandom }) => {
  const { colorMode } = useColorMode();
  const warningStyle = {
    light: { color: "yellow.400" },
    dark: { color: "yellow.700" }
  };
  return (
    <Flex direction="column" align="center">
      <Flex>
        Random is
        <Text
          mx={1}
          fontWeight="bold"
          color={isRandom ? "green.500" : "red.500"}
        >
          {isRandom ? "ON" : "OFF"}
        </Text>
        for this Page.
      </Flex>
      <Flex align="center" {...warningStyle[colorMode]}>
        <Box mr={1} as={FaExclamationTriangle} />
        Random Pages are only randomised *between* Fixed Pages.
      </Flex>
    </Flex>
  );
};

const PageActionButtons = ({ id, randomize }) => {
  const { deletePage, duplicatePage, setPageRandomize } = usePageListActions();
  const handleRandomClick = async e => {
    await setPageRandomize(id, e.target.checked);
  };

  return (
    <Flex align="center">
      <Tooltip
        maxW="auto"
        placement="top"
        hasArrow
        label={<RandomTooltip isRandom={randomize} />}
      >
        <ToggleButton
          variantColor="blue"
          onClick={handleRandomClick}
          defaultChecked={randomize}
          p={0}
          size="sm"
        >
          <Box as={FaRandom} />
        </ToggleButton>
      </Tooltip>

      <AddContentItemMenu />

      <Tooltip placement="top" hasArrow label="Duplicate this page">
        <DotHoverIconButton icon={FaCopy} onClick={() => duplicatePage(id)} />
      </Tooltip>

      <Tooltip placement="top" hasArrow label="Delete this page">
        <DotHoverIconButton
          variantColor="red"
          icon={FaTrash}
          onClick={() => deletePage(id)}
        />
      </Tooltip>
    </Flex>
  );
};

export default PageActionButtons;
