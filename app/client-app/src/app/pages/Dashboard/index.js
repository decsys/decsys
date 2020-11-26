import { useState, useEffect } from "react";
import {
  Page,
  StandardModal,
  ProgressCard,
  EmptyState,
  LoadingIndicator,
} from "components/core";
import { decode } from "services/instance-id";
import { useSurvey } from "api/surveys";
import { useSurveyInstanceResultsSummary } from "api/survey-instances";
import { Alert, AlertIcon, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import {
  dateTimeOffsetStringComparer,
  exportDateFormat as formatDate,
} from "services/date-formats";
import DetailsModalBody from "./DetailsModalBody";
import { getPageResponseItem } from "services/page-items";

const getDataByPage = (survey, results) => {
  // sort participants consistently,
  // not differing by individual page response submission
  results.participants = results.participants.sort((a, b) =>
    dateTimeOffsetStringComparer(a.surveyStarted, b.surveyStarted)
  );

  const resultsByPage = results.participants.reduce((a, p) => {
    p.responses.forEach((r) => {
      // page here is the page number, indexed from 1,
      // matching the survey configuration
      a[r.page] = a[r.page] || {};
      if (r.response) a[r.page][p.id] = r.response;
    });
    return a;
  }, {});

  const completionByPage = survey.pages.map((_, i) =>
    // pages in the survey are 0-indexed (becuase it's just an array)
    // and because this is a map, completionByPage will also be a 0-indexed array
    Object.keys(results.participants).reduce((a, k) => {
      const { id } = results.participants[k];
      // but in resultsByPage they're 1-indexed, as noted above
      a[id] = !!resultsByPage[i + 1] && !!resultsByPage[i + 1][id];
      return a;
    }, {})
  );

  return {
    resultsByPage,
    completionByPage,
  };
};

const Dashboard = ({ combinedId }) => {
  const [surveyId, instanceId] = decode(combinedId);
  const { data: survey } = useSurvey(surveyId);
  const { data: results } = useSurveyInstanceResultsSummary(
    surveyId,
    instanceId
  );

  const [{ resultsByPage, completionByPage }, setDataByPage] = useState({});
  useEffect(() => {
    if (survey && results) {
      setDataByPage(getDataByPage(survey, results));
    }
  }, [survey, results]);

  const [detailsPage, setDetailsPage] = useState();
  const detailsModal = useDisclosure();

  const handleCardClick = (i) => {
    setDetailsPage(survey.pages[i]);
    detailsModal.onToggle();
  };

  const surveyHasPages = !!survey.pages.length;
  const isLoading = surveyHasPages && !completionByPage?.length;

  return (
    <Page>
      <Stack>
        <LightHeading py={2} as="h2" size="lg">
          {survey.name}
        </LightHeading>
        <LightHeading as="h3" size="md">
          Dashboard for{" "}
          {results && formatDate(Date.parse(results.published)).flat}
        </LightHeading>
        <Flex justify="space-between" align="center">
          <LightHeading as="h5" size="md">
            Participant progress by Question
          </LightHeading>
          <Alert status="info" w="inherit">
            <AlertIcon />
            Click a Question's card for more details.
          </Alert>
        </Flex>
        {isLoading && <LoadingIndicator />}
        {surveyHasPages && !isLoading && (
          <Stack boxShadow="callout" spacing={0}>
            {survey.pages.map((p, i) => {
              const isResponsePage = !!getPageResponseItem(p.components);
              const completionData = completionByPage[i]; // 0-indexed array, matching `survey.pages`

              let noProgressMessage; // If there's no progress data, display a relevant message
              if (!isResponsePage)
                noProgressMessage = "This page doesn't gather reponses.";
              if (!Object.keys(completionData).length)
                noProgressMessage =
                  "The survey doesn't have any participants yet.";
              return (
                <ProgressCard
                  key={i}
                  title={`Page ${i + 1}`}
                  cardHeaderWidth="100px"
                  total={results.participants.length}
                  progressData={
                    !noProgressMessage // this is a reliable determinator of the presence of progress data
                      ? Object.keys(completionData).map((id) => ({
                          complete: completionData[id],
                        }))
                      : []
                  }
                  message={noProgressMessage}
                  lowProfile={!isResponsePage}
                  onClick={() => {
                    if (isResponsePage) return handleCardClick(i);
                  }}
                />
              );
            })}
          </Stack>
        )}
        {!surveyHasPages && <EmptyState message="This Survey has no pages!" />}
      </Stack>

      {detailsPage && (
        <StandardModal
          {...detailsModal}
          size="6xl"
          header={`Page ${detailsPage.order} Stats`}
          cancelButton={false}
        >
          <DetailsModalBody
            surveyId={surveyId}
            page={detailsPage}
            results={resultsByPage[detailsPage.order]} // 1-indexed
            completion={completionByPage[detailsPage.order - 1]} // 0-indexed
          />
        </StandardModal>
      )}
    </Page>
  );
};

export default Dashboard;
