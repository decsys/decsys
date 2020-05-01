import React from "react";
import { Page, EmptyState } from "components/core";
import SurveysList from "./components/SurveysList";
import { useDisclosure, Alert, AlertIcon, Box } from "@chakra-ui/core";
import PageHeader from "./components/PageHeader";
import AddSurveyModal from "./components/AddSurveyModal";
import { useSurveysList } from "api/surveys";
import { AddSurveyActionsProvider } from "./contexts/AddSurveyActions";
import { SurveyCardActionsProvider } from "./contexts/SurveyCardActions";
import addSurveyActions from "./actions/addSurveyActions";
import surveyCardActions from "./actions/surveyCardActions";
import { FaList } from "react-icons/fa";

const ShowSurveys = ({ surveys, actions }) => (
  <>
    <Alert status="info">
      <AlertIcon />
      Please don't forget to backup your surveys and results to an external
      source.
    </Alert>

    <SurveyCardActionsProvider value={actions}>
      <SurveysList surveys={surveys} />
    </SurveyCardActionsProvider>
  </>
);

const NoSurveys = ({ action }) => (
  <Box mt={9}>
    <EmptyState
      splash={FaList}
      message="You don't have any surveys yet."
      callToAction={{
        label: "Add a Survey",
        onClick: action,
        variantColor: "blue"
      }}
    />
  </Box>
);

const Surveys = ({ navigate }) => {
  const { data: surveys, mutate: mutateSurveys } = useSurveysList();

  const addSurveyModal = useDisclosure();

  const AddSurveyActions = addSurveyActions(navigate, mutateSurveys);
  const SurveyCardActions = surveyCardActions(navigate, mutateSurveys);

  const pageBody = Object.keys(surveys).length ? (
    <ShowSurveys surveys={surveys} actions={SurveyCardActions} />
  ) : (
    <NoSurveys action={addSurveyModal.onOpen} />
  );

  return (
    <>
      <Page>
        <PageHeader buttonAction={addSurveyModal.onOpen} />

        {pageBody}
      </Page>

      <AddSurveyActionsProvider value={AddSurveyActions}>
        <AddSurveyModal modalState={addSurveyModal} />
      </AddSurveyActionsProvider>
    </>
  );
};

export default Surveys;
