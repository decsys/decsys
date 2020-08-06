import React, { useState, useEffect } from "react";
import { Page, StandardModal, ProgressCard } from "components/core";
import { decode } from "services/instance-id";
import { useSurvey } from "api/surveys";
import { useSurveyInstanceResultsSummary } from "api/survey-instances";
import {
  Alert,
  AlertIcon,
  Flex,
  Stack,
  useDisclosure,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  useTheme,
  useColorMode,
} from "@chakra-ui/core";
import { getComponent, getPageResponseItem } from "services/page-items";
import { Body as SurveyPageBody } from "components/shared/SurveyPage";
import LightHeading from "components/core/LightHeading";
import { exportDateFormat as formatDate } from "services/date-formats";

const getDataByPage = (survey, results) => {
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

const StatCard = ({ label, value }) => {
  const { colorMode } = useColorMode();
  const {
    sharedStyles: { card },
  } = useTheme();
  return (
    <Flex p={4} {...card[colorMode]}>
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
      </Stat>
    </Flex>
  );
};

const StatsGrid = ({ details, results, stats }) => (
  <SimpleGrid minChildWidth="200px" spacing={4}>
    <StatCard label="Response Type" value={details.type} />
    <StatCard label="Participants" value={Object.keys(results).length} />

    {Object.keys(stats.stats).map((name) => (
      <StatCard label={name} value={stats.stats[name]} />
    ))}
  </SimpleGrid>
);

const Stats = ({ surveyId, page, results }) => {
  if (!page) return null;

  if (!results || !Object.keys(results).length) {
    return (
      <Alert status="warning">
        <AlertIcon />
        There is no data for this question yet.
      </Alert>
    );
  }

  const details = getPageResponseItem(page.components);
  const component = getComponent(details.type);
  const statsFn =
    component.stats ||
    (() => ({ visualizations: [{ component: null }], stats: [] }));

  const stats = statsFn(
    { ...component.defaultProps, ...details.params },
    Object.keys(results).map((pid) => results[pid])
  );

  const nop = () => {};
  const renderContext = {
    pageId: page.id,
    surveyId,
    setNextEnabled: nop,
    logEvent: nop,
  };

  return (
    <Tabs w="100%">
      <TabList>
        <Tab>Stats</Tab>
        {stats.visualizations[0].component && <Tab>Visualisation</Tab>}
        <Tab>Page Preview</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <StatsGrid details={details} results={results} stats={stats} />
        </TabPanel>

        {stats.visualizations[0].component && (
          <TabPanel d="flex" w="100%" justifyContent="center">
            <Flex w="70%">{stats.visualizations[0].component}</Flex>
          </TabPanel>
        )}

        <TabPanel>
          <Stack>
            <SurveyPageBody page={page} renderContext={renderContext} />
          </Stack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

const Dashboard = ({ combinedId }) => {
  const [surveyId, instanceId] = decode(combinedId);
  const { data: survey } = useSurvey(surveyId);
  const { data: results } = useSurveyInstanceResultsSummary(
    // TODO: make sure this polls every 10 seconds, using SWR
    surveyId,
    instanceId
  );

  const [{ resultsByPage, completionByPage }, setDataByPage] = useState({});
  useEffect(() => {
    survey && results && setDataByPage(getDataByPage(survey, results));
  }, [survey, results]);

  const [statsPage, setStatsPage] = useState();
  const statsModal = useDisclosure();

  const handleCardClick = (i) => {
    setStatsPage(survey.pages[i]);
    statsModal.onToggle();
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
            {survey.pages.map(
              (p, i) =>
                !!getPageResponseItem(p.components) && (
                  <ProgressCard
                    key={i}
                    title={`Q${i + 1}`}
                    cardHeaderWidth="50px"
                    total={results.participants.length}
                    progressData={Object.keys(completionByPage[i]).map(
                      (id) => ({
                        complete: completionByPage[i][id],
                      })
                    )}
                    onClick={() => handleCardClick(i)}
                  />
                )
            )}
          </Stack>
        )}
      </Stack>

      {statsPage && (
        <StandardModal
          {...statsModal}
          size="6xl"
          header={`Q${statsPage.order} Stats`}
          cancelButton={false}
        >
          <Stats
            surveyId={surveyId}
            page={statsPage}
            results={resultsByPage[statsPage.order]}
          />
        </StandardModal>
      )}
    </Page>
  );
};

export default Dashboard;
