import React, { useState } from "react";
import { Grid, Flex } from "@chakra-ui/core";
import PageList from "./components/PageList";
import EditorBar from "./components/EditorBar";
import editorBarActions from "./actions/editorBarActions";
import { useSurvey } from "api/surveys";
import { SurveyProvider } from "app/contexts/Survey";
import { EditorBarContextProvider } from "./contexts/EditorBar";
import { Page } from "components/core";
import pageListActions from "./actions/pageListActions";
import { PageListActionsProvider } from "./contexts/PageListActions";

const Editor = ({ id, navigate }) => {
  const { data: survey, mutate } = useSurvey(id);
  const [nameState, setNameState] = useState({});
  const EditorBarActions = editorBarActions(id, navigate, mutate, setNameState);
  const PageListActions = pageListActions(id, mutate);

  return (
    <Page layout={null}>
      <SurveyProvider value={survey}>
        <Grid
          templateColumns="2fr 5fr"
          templateRows="auto minmax(200px, 2fr) minmax(200px, 1fr)"
          gap={0}
          height="100%"
          style={{ height: "100vh" }}
        >
          <Flex boxShadow="section-h" gridColumn="span 2">
            <EditorBarContextProvider
              value={{ ...EditorBarActions, nameState }}
            >
              <EditorBar {...survey} />
            </EditorBarContextProvider>
          </Flex>

          <Flex boxShadow="section-v" gridRow="span 2">
            <PageListActionsProvider value={PageListActions}>
              <PageList />
            </PageListActionsProvider>
          </Flex>

          <Flex>Page Editor</Flex>
          <Flex>Params Editor</Flex>
        </Grid>
      </SurveyProvider>
    </Page>
  );
};

export default Editor;
