import { useState } from "react";
import { Page, EmptyState } from "components/core";
import SurveysList from "./components/SurveysList";
import { useDisclosure, Box, Alert, AlertIcon } from "@chakra-ui/react";
import { PageHeader } from "./components/PageHeader";
import AddSurveyModal from "./components/AddSurveyModal";
import { useSurveysList } from "api/surveys";
import { AddSurveyActionsProvider } from "./contexts/AddSurveyActions";
import { SurveyCardActionsProvider } from "./contexts/SurveyCardActions";
import { addSurveyActions } from "./actions/addSurveyActions";
import { surveyCardActions } from "./actions/surveyCardActions";
import { FaList } from "react-icons/fa";
import { SurveysListProvider } from "./contexts/SurveysList";

const ShowSurveys = ({ surveys, actions }) => (
  <>
    <Alert>
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
        colorScheme: "blue",
      }}
    />
  </Box>
);

const Surveys = ({ navigate }) => {
  const { data: surveys, mutate: mutateSurveys } = useSurveysList();

  const addSurveyModal = useDisclosure();
  const [addStudy, setAddStudy] = useState(false);

  const AddSurveyActions = addSurveyActions(navigate, mutateSurveys);
  const SurveyCardActions = surveyCardActions(navigate, mutateSurveys);

  const handleAddSurvey = () => {
    setAddStudy(false);
    addSurveyModal.onOpen();
  };

  const handleAddStudy = () => {
    setAddStudy(true);
    addSurveyModal.onOpen();
  };

  const pageBody = Object.keys(surveys).length ? (
    <ShowSurveys surveys={surveys} actions={SurveyCardActions} />
  ) : (
    <NoSurveys action={handleAddSurvey} />
  );

  return (
    <SurveysListProvider value={{ surveys, mutateSurveys }}>
      <AddSurveyActionsProvider value={AddSurveyActions}>
        <Page>
          <PageHeader
            addSurveyAction={handleAddSurvey}
            addStudyAction={handleAddStudy}
          />

          {pageBody}
        </Page>

        <AddSurveyModal modalState={addSurveyModal} isStudy={addStudy} />
      </AddSurveyActionsProvider>
    </SurveysListProvider>
  );
};

export default Surveys;
