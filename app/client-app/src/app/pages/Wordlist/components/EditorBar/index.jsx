import { Flex, Grid, useColorMode } from "@chakra-ui/react";
import { useFetchWordlist } from "../context/FetchWordlist";
import { useEditorBarContext } from "../context/EditorBar";
import NameInput from "components/shared/NameInput";
import { DeleteButton } from "app/pages/Wordlists/component/DeleteWordlistModal";
import { navigate } from "@reach/router";
import { BackButton } from "app/pages/Editor/components/EditorBar/Buttons";

const EditorBar = () => {
  const { id, name } = useFetchWordlist();
  const { saveName, nameState } = useEditorBarContext();
  const { colorMode } = useColorMode();
  const bg = { light: "gray.800" };
  const handleRemoveWordList = () => {
    navigate("/admin/wordlists");
  };

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
      <DeleteButton wordlistId={id} onRemoveWordList={handleRemoveWordList} />
    </Grid>
  );
};

export default EditorBar;
