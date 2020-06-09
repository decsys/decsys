import React from "react";
import { Flex, Tooltip, Box, Text, useColorMode } from "@chakra-ui/core";
import {
  FaTrash,
  FaCopy,
  FaRandom,
  FaExclamationTriangle
} from "react-icons/fa";
import { DotHoverIconButton, ToggleButton } from "components/core";
import { usePageListContext } from "../../contexts/PageList";
import AddContentItemMenu from "./AddContentItemMenu";
import { some } from "services/flags";
import PlaceholderDot from "components/core/PlaceholderDot";

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

const ActionButtons = ({ id }) => {
  const { deletePage, duplicatePage } = usePageListContext();

  return (
    <>
      <AddContentItemMenu id={id} />

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
    </>
  );
};

const ActionPlaceholders = () => (
  <>
    <PlaceholderDot variantColor="green" p={3} />
    <PlaceholderDot p={3} />
    <PlaceholderDot variantColor="red" p={3} />
  </>
);

const PageActionButtons = ({ id, randomize, isLoading }) => {
  const { busy, setPageRandomize } = usePageListContext();
  const isBusy = isLoading || some(busy);

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
        hidden={isBusy}
      >
        <ToggleButton
          variantColor="blue"
          onClick={!isBusy && handleRandomClick}
          checked={randomize}
          p={0}
          size="sm"
        >
          <Box as={FaRandom} />
        </ToggleButton>
      </Tooltip>

      {isBusy ? <ActionPlaceholders /> : <ActionButtons id={id} />}
    </Flex>
  );
};

export default PageActionButtons;
