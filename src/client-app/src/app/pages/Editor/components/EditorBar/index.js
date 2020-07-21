import React from "react";
import { Grid, Flex, useColorMode, DarkMode } from "@chakra-ui/core";
import {
  BackButton,
  PreviewButton,
  ExportButton,
  DuplicateButton,
  DeleteButton,
} from "./Buttons";
import ToggleColorModeButton from "components/core/ToggleColorModeButton";
import NameInput from "./NameInput";
import { useFetchSurvey } from "app/contexts/FetchSurvey";

const EditorBar = () => {
  const { id, name } = useFetchSurvey();
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

      <DarkMode>
        <NameInput name={name} />
      </DarkMode>

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
