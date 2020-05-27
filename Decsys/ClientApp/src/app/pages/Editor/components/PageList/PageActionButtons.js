import React from "react";
import {
  Flex,
  Tooltip,
  Box,
  Text,
  useColorMode,
  Button
} from "@chakra-ui/core";
import {
  FaTrash,
  FaCopy,
  FaRandom,
  FaExclamationTriangle
} from "react-icons/fa";
import { DotHoverIconButton, ToggleButton } from "components/core";
import { usePageListActions } from "../../contexts/PageListActions";
import AddContentItemMenu from "./AddContentItemMenu";
import { BsDot } from "react-icons/bs";

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

const PlaceholderDotButton = p => (
  <Button p={0} variant="ghost" {...p}>
    <Box as={BsDot} />
  </Button>
);

const Placeholder = () => (
  <>
    <PlaceholderDotButton variantColor="blue" size="sm" />
    <PlaceholderDotButton variantColor="green" />
    <PlaceholderDotButton />
    <PlaceholderDotButton variantColor="red" />
  </>
);

const ActionButtons = ({ id, randomize }) => {
  const { deletePage, duplicatePage, setPageRandomize } = usePageListActions();
  const handleRandomClick = async e => {
    await setPageRandomize(id, e.target.checked);
  };

  return (
    <>
      <Tooltip
        maxW="auto"
        placement="top"
        hasArrow
        label={<RandomTooltip isRandom={randomize} />}
      >
        <ToggleButton
          variantColor="blue"
          onClick={handleRandomClick}
          checked={randomize}
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
    </>
  );
};

const PageActionButtons = ({ busy, ...p }) => (
  <Flex align="center">
    {busy ? <Placeholder /> : <ActionButtons {...p} />}
  </Flex>
);

export default PageActionButtons;
