import { useEffect, useState } from "react";
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
import { BusyPage } from "components/core";
import { useLocation } from "@reach/router";
import { useDebounce } from "../Editor/components/Helpers/useDebounce";
import { AddFolderModal } from "./components/AddFolderModal";

const ShowSurveys = ({ actions, ...props }) => (
  <>
    <Alert>
      <AlertIcon />
      Please don't forget to backup your surveys and results to an external
      source.
    </Alert>

    <SurveyCardActionsProvider value={actions}>
      <SurveysList {...props} />
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

const Surveys = ({ navigate, parentFolderName }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [filterType, setFilterType] = useState(
    queryParams.get("filter") || "unarchived"
  );
  const [sortBy, setSortBy] = useState(queryParams.get("sort") || "name");
  const [direction, setDirection] = useState(
    queryParams.get("direction") || "up"
  );
  const [pageIndex, setPageIndex] = useState(
    parseInt(queryParams.get("page") || "0")
  );
  const [pageSize, setPageSize] = useState(
    parseInt(queryParams.get("size") || "10")
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, mutate: mutateSurveys } = useSurveysList({
    name: debouncedSearchTerm,
    view: filterType,
    sortBy,
    direction,
    isStudy: false,
    canChangeStudy: false,
    pageIndex,
    pageSize,
    parentFolderName: parentFolderName ?? "",
  });
  useEffect(() => {
    mutateSurveys();
  }, [
    debouncedSearchTerm,
    filterType,
    sortBy,
    direction,
    pageIndex,
    pageSize,
    mutateSurveys,
  ]);

  useEffect(() => {
    setPageIndex(0); // reset to first page whenever filter is changed
  }, [debouncedSearchTerm, filterType, sortBy, direction]);

  let surveys = data.surveyItems;
  parentFolderName
    ? (surveys = surveys.filter(
        (survey) => survey.parentFolderName === parentFolderName
      ))
    : (surveys = surveys.filter((survey) => !survey.parentFolderName));

  const totalItemCount = parentFolderName
    ? Math.ceil(data.surveyCount + data.studyCount)
    : Math.ceil(data.surveyCount + data.studyCount + data.folderCount);

  const addSurveyModal = useDisclosure();
  const addFolderModal = useDisclosure();

  const [addStudy, setAddStudy] = useState(false);
  const [addFolder, setAddFolder] = useState(false);

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

  const handleAddFolder = () => {
    setAddFolder(true);
    addFolderModal.onOpen();
  };

  let surveyArea = <BusyPage verb="Fetching" noun="Surveys" />;

  const pageBody = surveys.length ? (
    (surveyArea = (
      <ShowSurveys
        surveys={surveys}
        totalCount={totalItemCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        direction={direction}
        setDirection={setDirection}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        mutateSurveys={mutateSurveys}
        actions={SurveyCardActions}
        parentFolderName={parentFolderName}
      />
    ))
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
            addFolderAction={handleAddFolder}
            parentFolderName={parentFolderName}
          />
          {pageBody}
        </Page>

        <AddSurveyModal
          modalState={addSurveyModal}
          isStudy={addStudy}
          parentFolderName={parentFolderName}
        />
        <AddFolderModal
          modalState={addFolderModal}
          mutateSurveys={mutateSurveys}
        />
      </AddSurveyActionsProvider>
    </SurveysListProvider>
  );
};

export default Surveys;
