import React from "react";
import { Grid, useColorMode } from "@chakra-ui/core";
import {
  BackButton,
  PreviewButton,
  ExportButton,
  DuplicateButton,
  DeleteButton,
} from "./Buttons";
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

      <NameInput name={name} />

      <PreviewButton />
      <ExportButton id={id} name={name} />
      <DuplicateButton />
      <DeleteButton name={name} />
    </Grid>
  );
};

export default EditorBar;
