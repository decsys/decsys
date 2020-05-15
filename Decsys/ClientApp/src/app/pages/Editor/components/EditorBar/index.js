import React from "react";
import { Grid, Flex, useColorMode } from "@chakra-ui/core";
import {
  BackButton,
  PreviewButton,
  ExportButton,
  DuplicateButton,
  DeleteButton
} from "./Buttons";
import ToggleColorModeButton from "components/core/ToggleColorModeButton";
import NameInput from "./NameInput";

const EditorBar = ({ id, name }) => {
  const { colorMode } = useColorMode();
  const bg = { light: "gray.800" };

  return (
    <Grid
      width="100%"
      gap={0}
      templateColumns="auto 1fr auto auto auto auto auto"
      bg={bg[colorMode]}
    >
      <BackButton />

      <NameInput name={name} />

      <PreviewButton />
      <ExportButton id={id} name={name} />
      <DuplicateButton />
      <DeleteButton name={name} />

      <Flex align="center" justify="center" px={2} py={1}>
        <ToggleColorModeButton isAlwaysDark />
      </Flex>
    </Grid>
  );
};

export default EditorBar;
