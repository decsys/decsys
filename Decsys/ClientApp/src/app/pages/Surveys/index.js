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
  useSurveysList,
  deleteSurvey,
  duplicateSurvey
} from "api/surveys";
import { AddSurveyActionsProvider } from "./contexts/AddSurveyActions";
import { SurveyCardActionsProvider } from "./contexts/SurveyCardActions";

const Surveys = ({ navigate }) => {
  const { data: surveys, mutate: mutateSurveys } = useSurveysList();

  const addSurveyModal = useDisclosure();

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

  const SurveyCardActions = {
    launch: () => {},
    close: () => {},
    duplicate: async id => {
      await duplicateSurvey(id);
      mutateSurveys();
    },
    deleteSurvey: async id => {
      await deleteSurvey(id);
      mutateSurveys();
    },
    navigate
  };

  return (
    <>
      <Page>
        <PageHeader buttonAction={addSurveyModal.onOpen} />

        <SurveyCardActionsProvider value={SurveyCardActions}>
          <SurveysList surveys={surveys} />
        </SurveyCardActionsProvider>
      </Page>

      <AddSurveyActionsProvider value={AddSurveyActions}>
        <AddSurveyModal modalState={addSurveyModal} />
      </AddSurveyActionsProvider>
    </>
  );
};
export default Surveys;
