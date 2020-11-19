import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { BsDot } from "react-icons/bs";
import { defaultColorMode } from "themes";

const PlaceholderDot = ({ colorScheme, dotSize = "16px", ...p }) => {
  const { colorMode } = useColorMode();
  const shades = (color) =>
    `${color}.${{ light: 500, dark: 200 }[colorMode || defaultColorMode]}`;
  const bw = { light: "black", dark: "white" };
  return (
    <Box {...p}>
      <Box
        as={BsDot}
        color={
          !colorScheme ? bw[colorMode || defaultColorMode] : shades(colorScheme)
        }
        height={dotSize}
        width={dotSize}
      />
    </Box>
  );
};

export default PlaceholderDot;
