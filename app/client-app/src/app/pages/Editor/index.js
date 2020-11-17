import React, { useState } from "react";
import { Grid, Flex, useColorMode } from "@chakra-ui/react";
import PageList from "./components/PageList";
import EditorBar from "./components/EditorBar";
import { Page, EmptyState } from "components/core";
import { SurveyEditorContextProvider } from "./contexts/SurveyEditor";
import { usePageListContext } from "./contexts/PageList";
import PagePreview from "./components/PagePreview";
import { FaFileAlt } from "react-icons/fa";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import PageItemEditor from "./components/PageItemEditor";
import { defaultColorMode } from "themes";

const NoPages = ({ addPage }) => (
  <EmptyState
    message="Get your Survey started with a new Page"
    splash={FaFileAlt}
    callToAction={{
      label: "Add a Page",
      onClick: addPage,
    }}
  />
);

const NoSelection = () => {
  const { pages } = useFetchSurvey();
  const { addPage } = usePageListContext();
  if (!pages?.length) return <NoPages addPage={addPage} />;
  return <EmptyState message="Select a Page Item to edit" />;
};

const Editor = ({ id, navigate }) => {
  // This is top level state, since we use it here,
  // we ultimately expose it to children through the PageList context
  const [selectedPageItem, setSelectedPageItem] = useState({
    pageId: undefined,
    itemId: undefined,
  });

  const { colorMode } = useColorMode();
  const bg = { light: "gray.100", dark: "gray.900" };

  return (
    <Page layout={null}>
      <SurveyEditorContextProvider
        id={id}
        navigate={navigate}
        selectedPageItem={selectedPageItem}
        setSelectedPageItem={setSelectedPageItem}
      >
        <Grid
          templateColumns="minmax(350px, 2fr) 5fr"
          templateRows="auto minmax(200px, 2fr) minmax(200px, 1fr)"
          gap={0}
          height="100vh"
        >
          <Flex boxShadow="section-h" gridColumn="span 2" zIndex={3}>
            <EditorBar />
          </Flex>

          <Flex boxShadow="section-v" gridRow="span 2" zIndex={2}>
            <PageList />
          </Flex>

          {!selectedPageItem?.pageId ? (
            <Flex gridRow="span 2">
              <NoSelection />
            </Flex>
          ) : (
            <>
              <Flex boxShadow="section-v" overflowY="auto" zIndex={1}>
                <PagePreview />
              </Flex>
              <Flex overflowY="auto" bg={bg[colorMode || defaultColorMode]}>
                <PageItemEditor />
              </Flex>
            </>
          )}
        </Grid>
      </SurveyEditorContextProvider>
    </Page>
  );
};

export default Editor;
