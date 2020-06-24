import React, { useState, useMemo } from "react";
import { Grid, Flex } from "@chakra-ui/core";
import PageList from "./components/PageList";
import EditorBar from "./components/EditorBar";
import editorBarActions from "./actions/editorBarActions";
import { useSurvey } from "api/surveys";
import { SurveyProvider } from "app/contexts/Survey";
import { EditorBarContextProvider } from "./contexts/EditorBar";
import { Page } from "components/core";
import pageListActions from "./actions/pageListActions";
import { PageListContextProvider } from "./contexts/PageList";

const Editor = ({ id, navigate }) => {
  const { data: survey, mutate } = useSurvey(id);

  const [nameState, setNameState] = useState({});
  const [busy, setBusy] = useState({});

  const EditorBarActions = useMemo(
    () => editorBarActions(id, navigate, mutate, setNameState),
    [id, navigate, mutate, setNameState]
  );
  const editorBarContext = { ...EditorBarActions, nameState };

  const PageListActions = useMemo(() => pageListActions(id, mutate), [
    id,
    mutate
  ]);
  const pageListContext = { ...PageListActions, busy, setBusy };

  return (
    <Page layout={null}>
      <SurveyProvider value={survey}>
        <Grid
          templateColumns="2fr 5fr"
          templateRows="auto minmax(200px, 2fr) minmax(200px, 1fr)"
          gap={0}
          height="100vh"
        >
          <Flex boxShadow="section-h" gridColumn="span 2">
            <EditorBarContextProvider value={editorBarContext}>
              <EditorBar {...survey} />
            </EditorBarContextProvider>
          </Flex>

          <Flex boxShadow="section-v" gridRow="span 2">
            <PageListContextProvider value={pageListContext}>
              <PageList />
            </PageListContextProvider>
          </Flex>

          <Flex>Page Editor</Flex>
          <Flex>Params Editor</Flex>
        </Grid>
      </SurveyProvider>
    </Page>
  );
};

export default Editor;
