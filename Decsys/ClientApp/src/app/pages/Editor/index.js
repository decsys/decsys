import React, { useState } from "react";
import { Grid, Flex } from "@chakra-ui/core";
import PageList from "./components/PageList";
import EditorBar from "./components/EditorBar";
import editorBarActions from "./actions/editorBarActions";
import { useSurvey } from "api/surveys";
import { SurveyProvider } from "app/contexts/Survey";
import { EditorBarActionsProvider } from "./contexts/EditorBarActions";
import { Page } from "components/core";

const Editor = ({ id, navigate }) => {
  const { data: survey, mutate } = useSurvey(id);
  const [nameState, setNameState] = useState({});
  const EditorBarActions = editorBarActions(id, navigate, mutate, setNameState);

  return (
    <Page layout={null}>
      <SurveyProvider value={survey}>
        <Grid
          templateColumns="1fr 2fr"
          templateRows="auto minmax(200px, 2fr) minmax(200px, 1fr)"
          gap={0}
          height="100%"
          style={{ height: "100vh" }}
        >
          <Flex boxShadow="0 2px 2px rgba(0,0,0,0.6)" gridColumn="span 2">
            <EditorBarActionsProvider
              value={{ ...EditorBarActions, nameState }}
            >
              <EditorBar {...survey} />
            </EditorBarActionsProvider>
          </Flex>

          <Flex boxShadow="2px 5px 5px rgba(0,0,0,0.6)" gridRow="span 2">
            <PageList />
          </Flex>

          <Flex>Page Editor</Flex>
          <Flex>Params Editor</Flex>
        </Grid>
      </SurveyProvider>
    </Page>
  );
};

export default Editor;
