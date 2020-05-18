import React from "react";
import { BsDot } from "react-icons/bs";
import { IconButton } from "@chakra-ui/core";

const DotHoverIconButton = ({ isHovered, icon, variantColor, ...p }) => (
  <IconButton
    variant="ghost"
    variantColor={isHovered ? variantColor : "gray"}
    icon={isHovered ? icon : BsDot}
    {...p}
  />
);

export default DotHoverIconButton;
