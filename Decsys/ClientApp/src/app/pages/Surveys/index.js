import React from "react";
import { Page } from "components/core";
import SurveysList from "./components/SurveysList";
import { useDisclosure } from "@chakra-ui/core";
import PageHeader from "./components/PageHeader";
import AddSurveyModal from "./components/AddSurveyModal";
import {
  createSurvey,
  uploadSurveyImport,
  loadInternalSurvey,
  useSurveysList
} from "api/surveys";
import { AddSurveyActionsProvider } from "./contexts/AddSurveyActions";

const Surveys = ({ navigate }) => {
  const { data: surveys, mutate: mutateSurveys } = useSurveysList();

  const addSurveyModal = useDisclosure();

  // handlers that mutate surveys
  const AddSurveyActions = {
    create: async () => {
      const { data: id } = await createSurvey();
      navigate(`survey/${id}`);
    },
    importFile: async (file, importData) => {
      await uploadSurveyImport(file, importData);
      mutateSurveys();
    },
    loadInternal: async type => {
      await loadInternalSurvey(type);
      mutateSurveys();
    }
  };

  return (
    <>
      <Page>
        <PageHeader buttonAction={addSurveyModal.onOpen} />
        <SurveysList surveys={surveys} />
      </Page>

      <AddSurveyActionsProvider value={AddSurveyActions}>
        <AddSurveyModal modalState={addSurveyModal} />
      </AddSurveyActionsProvider>
    </>
  );
};
export default Surveys;
