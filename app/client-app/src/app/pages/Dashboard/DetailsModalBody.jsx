import { useMemo } from "react";
import {
  Alert,
  AlertIcon,
  Flex,
  Stack,
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
} from "@chakra-ui/react";
import { getComponent, getPageResponseItem } from "services/page-items";
import { Body as SurveyPageBody } from "components/shared/SurveyPage";
import { defaultColorMode } from "themes";
import Visualizations from "./Visualizations";

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

const DetailsModalBody = ({ surveyId, page, results, completion }) => {
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
        There are no data for this question yet.
      </Alert>
    );
  }

  const nop = () => {};
  const renderContext = {
    pageId: page.id,
    surveyId,
    setIsValidResponse: nop,
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
          <Visualizations
            visualizations={stats.visualizations}
            completion={completion}
          />
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

export default DetailsModalBody;
