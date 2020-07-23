import React from "react";
import { useColorMode, Flex, Icon } from "@chakra-ui/core";
import { FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

// Home grown Alert component while chakra's is broken.
// it only contains the features the codebase already used of chakra's.
// should make the API such that we can replace the internals of this with chakra when ready
// and leave the call sites alone?
// TODO: replace with chakra version when possible

//--
// Status Color Styles
//--
const colorLookup = {
  light: {
    info: { accent: "blue.500", main: "blue.100" },
    error: { accent: "red.500", main: "red.100" },
    fg: "black",
  },
  dark: {
    info: { accent: "blue.200", main: "blue.900" },
    error: { accent: "red.200", main: "red.900" },
    fg: "white",
  },
};

const getColorStyles = (status, mode = "light") => ({
  ...colorLookup[mode][status],
  fg: colorLookup[mode].fg,
});

//--
// Variant Containers
//--
const BaseContainer = (p) => (
  <Flex p={3} align="center" direction="row" {...p} />
);

const SubtleContainer = ({ colors, ...p }) => (
  <BaseContainer bg={colors.main} color={colors.fg} {...p} />
);

const LeftAccentContainer = ({ colors, ...p }) => (
  <SubtleContainer
    borderLeftWidth={5}
    borderColor={colors.accent}
    colors={colors}
    {...p}
  />
);

const containerLookup = {
  subtle: SubtleContainer,
  "left-accent": LeftAccentContainer,
};

//--
// AlertIcon
//--
const iconLookup = {
  info: FaInfoCircle,
  error: FaExclamationCircle,
};

const AlertIcon = ({ status, colors }) => (
  <Flex mr={2}>
    <Icon as={iconLookup[status]} color={colors.accent} boxSize="1.3em" />
  </Flex>
);

//--
// Alert
//--
const Alert = ({
  status = "info",
  variant = "subtle",
  hasIcon,
  children,
  ...p
}) => {
  const { colorMode } = useColorMode();
  const colors = getColorStyles(status, colorMode);

  const Container = containerLookup[variant];

  return (
    <Container colors={colors} {...p}>
      {hasIcon && <AlertIcon status={status} colors={colors} />}
      <Flex>{children}</Flex>
    </Container>
  );
};

export default Alert;
