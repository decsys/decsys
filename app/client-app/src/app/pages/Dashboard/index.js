import React, { useState, useEffect } from "react";
import { Page, StandardModal, ProgressCard } from "components/core";
import { decode } from "services/instance-id";
import { useSurvey } from "api/surveys";
import { useSurveyInstanceResultsSummary } from "api/survey-instances";
import { Alert, AlertIcon, Flex, Stack, useDisclosure } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import {
  dateTimeOffsetStringComparer,
  exportDateFormat as formatDate,
} from "services/date-formats";
import DetailsModalBody from "./DetailsModalBody";

const getDataByPage = (survey, results) => {
  results.participants = results.participants.sort((a, b) =>
    dateTimeOffsetStringComparer(a.surveyStarted, b.surveyStarted)
  );

  const resultsByPage = results.participants.reduce((a, p) => {
    p.responses.forEach((r) => {
      a[r.page] = a[r.page] || {};
      if (r.response) a[r.page][p.id] = r.response;
    });
    return a;
  }, []);

  const completionByPage = survey.pages.map((_, i) =>
    results.participants.reduce((a, { id }) => {
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
    survey && results && setDataByPage(getDataByPage(survey, results));
  }, [survey, results]);

  const [detailsPage, setDetailsPage] = useState();
  const detailsModal = useDisclosure();

  const handleCardClick = (i) => {
    setDetailsPage(survey.pages[i]);
    detailsModal.onToggle();
  };

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
        {completionByPage?.length && (
          <Stack boxShadow="callout" spacing={0}>
            {survey.pages.map((_, i) => {
              const completionData = completionByPage[i];
              // Pages without responses will be nullish in resultsByPage
              // so we use that to distinguish
              const hasResponses = !!resultsByPage[i];
              return (
                <ProgressCard
                  key={i}
                  title={`Page ${i + 1}`}
                  cardHeaderWidth="100px"
                  total={results.participants.length}
                  progressData={
                    hasResponses
                      ? Object.keys(completionData).map((id) => ({
                          complete: completionData[id],
                        }))
                      : []
                  }
                  message={
                    !hasResponses && "This page doesn't gather reponses."
                  }
                  lowProfile={!hasResponses}
                  onClick={() => {
                    if (hasResponses) return handleCardClick(i);
                  }}
                />
              );
            })}
          </Stack>
        )}
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
            results={resultsByPage[detailsPage.order]}
            completion={completionByPage[detailsPage.order - 1]}
          />
        </StandardModal>
      )}
    </Page>
  );
};

export default Dashboard;
