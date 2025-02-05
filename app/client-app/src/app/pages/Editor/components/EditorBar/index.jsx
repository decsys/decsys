import { Grid, Flex, useColorMode } from "@chakra-ui/react";
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
import { useSurvey } from "api/surveys";

const EditorBar = () => {
  const { id, name, pages, parentFolderName } = useFetchSurvey();
  const { saveName, nameState } = useEditorBarContext();
  const { colorMode } = useColorMode();
  const bg = { light: "gray.800" };
  const hasPages = pages.length !== 0;
  return (
    <Grid
      width="100%"
      gap={0}
      templateColumns="auto 1fr auto auto auto auto auto"
      bg={bg[colorMode || defaultColorMode]}
    >
      <BackButton parentFolderName={parentFolderName} />

      <Flex bg="gray.100">
        <NameInput
          name={name}
          handleNameSave={saveName}
          nameState={nameState}
        />
      </Flex>

      {hasPages && <PreviewButton />}
      <ExportButton id={id} name={name} />
      <DuplicateButton name={name} parentFolderName={parentFolderName} />
      <DeleteButton name={name} />
    </Grid>
  );
};

export default EditorBar;
