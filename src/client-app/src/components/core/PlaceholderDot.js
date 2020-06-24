import React from "react";
import { Box, useColorMode } from "@chakra-ui/core";
import { BsDot } from "react-icons/bs";

const PlaceholderDot = ({ variantColor, dotSize = "16px", ...p }) => {
  const { colorMode } = useColorMode();
  const shades = color => `${color}.${{ light: 500, dark: 200 }[colorMode]}`;
  const bw = { light: "black", dark: "white" };
  return (
    <Box {...p}>
      <Box
        as={BsDot}
        color={!variantColor ? bw[colorMode] : shades(variantColor)}
        height={dotSize}
        width={dotSize}
      />
    </Box>
  );
};

export default PlaceholderDot;
