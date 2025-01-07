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

const Surveys = ({ navigate }) => {
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
  });

  const { data: intialSurveys } = useSurveysList();

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

  const surveys = data.surveys;
  const totalItemCount = Math.ceil(data.totalCount - data.studyTotalCount);

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

  let surveyArea = <BusyPage verb="Fetching" noun="Surveys" />;
  const pageBody = Object.keys(intialSurveys.surveys).length ? (
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
          />

          {pageBody}
        </Page>

        <AddSurveyModal modalState={addSurveyModal} isStudy={addStudy} />
      </AddSurveyActionsProvider>
    </SurveysListProvider>
  );
};

export default Surveys;
