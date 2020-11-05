import React, { useState, useEffect, useMemo } from "react";
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
import {
  dateTimeOffsetStringComparer,
  exportDateFormat as formatDate,
} from "services/date-formats";
import { defaultColorMode } from "themes";
import Plot from "react-plotly.js";
import { Text } from "@chakra-ui/core";
import ReactWordcloud from "react-wordcloud";

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

const StatCard = ({ label, value }) => {
  const { colorMode } = useColorMode();
  const {
    sharedStyles: { card },
  } = useTheme();
  return (
    <Flex p={4} {...card[colorMode || defaultColorMode]}>
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
      <StatCard key={name} label={name} value={stats.stats[name]} />
    ))}
  </SimpleGrid>
);

// we apply config to plotly visualizations, not the response item author.
const plotlyConfig = {
  scrollZoom: false,
  displaylogo: false,
  modeBarButtonsToRemove: [
    //"zoom2d",
    //"pan2d",
    //"select2d",
    //"lasso2d",
    //"zoomIn2d",
    //"zoomOut2d",
    //"autoScale2d",
    //"resetScale2d",
    "zoom3d",
    "pan3d",
    "orbitRotation",
    "tableRotation",
    "handleDrag3d",
    "resetCameraDefault3d",
    "resetCameraLastSave3d",
    "hoverClosest3d",
    "hoverClosestCartesian",
    "hoverCompareCartesian",
    "zoomInGeo",
    "zoomOutGeo",
    "resetGeo",
    "hoverClosestGeo",
    "hoverClosestGl2d",
    "hoverClosestPie",
    "toggleHover",
    "resetViews",
    //"toImage",
    "sendDataToCloud",
    "toggleSpikelines",
    "resetViewMapbox",
  ],
};

const Visualizations = ({ visualizations = [] }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Tabs
      w="100%"
      orientation="vertical"
      display="grid"
      gridTemplateColumns="auto 1fr"
      variant="soft-rounded"
      size="sm"
      index={tabIndex}
      onChange={setTabIndex}
    >
      <TabList>
        <Text mb={2}>Visualizations:</Text>
        <Tab>% Participants</Tab>
        {visualizations.map((v, i) => (
          <Tab key={i}>{v.name ?? `Visualisation ${i}`}</Tab>
        ))}
      </TabList>
      <TabPanels w="100%">
        <TabPanel>Hello</TabPanel>

        {visualizations.map((v, i) => (
          <TabPanel key={i}>
            {i === tabIndex - 1 && (
              // We deliberately re-mount if this is the selected tab
              // as some Viz components are unhappy with the way
              // Chakra tabs show and hide panel content (e.g. react-wordcloud)
              <Flex>
                <Visualization visualization={v} />
              </Flex>
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

const Visualization = ({ visualization }) =>
  useMemo(() => {
    switch (visualization?.type) {
      // TODO: Document the available built-in types
      case "plotly":
        const { config, ...plotly } = visualization.plotly; // throw away the config, if any
        return <Plot {...plotly} config={plotlyConfig} />;
      case "wordcloud":
        return <ReactWordcloud {...visualization.wordcloud} />;
      default:
        // render a component if there is one, or nothing
        return visualization?.component ?? null;
    }
  }, [visualization]);

const Stats = ({ surveyId, page, results }) => {
  const details = useMemo(
    () => (!!page ? getPageResponseItem(page.components) : null),
    [page]
  );

  const stats = useMemo(
    () => {
      if (!results || !details) return null;
      const component = getComponent(details.type);

      if (!component?.stats)
        return { visualizations: [{ component: null }], stats: [] };

      return component.stats(
        { ...(component?.defaultProps ?? {}), ...details.params },
        Object.keys(results).map((pid) => results[pid])
      );
    },
    // we use stringify to value compare instead of reference compare
    // eslint-disable-next-line
    [JSON.stringify(results), details]
  );

  if (!page) return null;

  if (!results || !Object.keys(results).length) {
    return (
      <Alert status="warning">
        <AlertIcon />
        There is no data for this question yet.
      </Alert>
    );
  }

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
        <Tab>Visualizations</Tab>
        <Tab>Page Preview</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <StatsGrid details={details} results={results} stats={stats} />
        </TabPanel>

        <TabPanel>
          <Visualizations visualizations={stats.visualizations} />
        </TabPanel>

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

      {statsPage && (
        <StandardModal
          {...statsModal}
          size="6xl"
          header={`Page ${statsPage.order} Stats`}
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
