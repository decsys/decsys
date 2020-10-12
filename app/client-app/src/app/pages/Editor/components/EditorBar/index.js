import React from "react";
import { Grid, Flex, useColorMode } from "@chakra-ui/core";
import {
  BackButton,
  PreviewButton,
  ExportButton,
  DuplicateButton,
  DeleteButton,
} from "./Buttons";
import NameInput from "components/shared/NameInput";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { defaultColorMode } from "themes";
import { useEditorBarContext } from "../../contexts/EditorBar";

const EditorBar = () => {
  const { id, name } = useFetchSurvey();
  const { saveName, nameState } = useEditorBarContext();
  const { colorMode } = useColorMode();
  const bg = { light: "gray.800" };

  return (
    <Grid
      width="100%"
      gap={0}
      templateColumns="auto 1fr auto auto auto auto auto"
      bg={bg[colorMode || defaultColorMode]}
    >
      <BackButton />

      <Flex bg="gray.100">
        <NameInput
          name={name}
          handleNameSave={saveName}
          nameState={nameState}
        />
      </Flex>

      <PreviewButton />
      <ExportButton id={id} name={name} />
      <DuplicateButton />
      <DeleteButton name={name} />
    </Grid>
  );
};

export default EditorBar;
