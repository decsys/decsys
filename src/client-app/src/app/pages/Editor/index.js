import React from "react";
import { Grid, Flex } from "@chakra-ui/core";
import PageList from "./components/PageList";
import EditorBar from "./components/EditorBar";
import { Page } from "components/core";
import { SurveyEditorContextProvider } from "./contexts/SurveyEditor";
import PagePreview from "./components/PagePreview";

const Editor = ({ id, navigate }) => {
  return (
    <Page layout={null}>
      <SurveyEditorContextProvider id={id} navigate={navigate}>
        <Grid
          templateColumns="2fr 5fr"
          templateRows="auto minmax(200px, 2fr) minmax(200px, 1fr)"
          gap={0}
          height="100vh"
        >
          <Flex boxShadow="section-h" gridColumn="span 2">
            <EditorBar />
          </Flex>

          <Flex boxShadow="section-v" gridRow="span 2">
            <PageList />
          </Flex>

          <Flex>
            <PagePreview />
          </Flex>
          <Flex>Params Editor</Flex>
        </Grid>
      </SurveyEditorContextProvider>
    </Page>
  );
};

export default Editor;
