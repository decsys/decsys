import React, { useState, useEffect, useMemo } from "react";
import { Page, StandardModal, ProgressCard } from "components/core";
import { decode } from "services/instance-id";
import { useSurvey } from "api/surveys";
import { useSurveyInstanceResultsSummary } from "api/survey-instances";
import { Alert, AlertIcon, Flex, Stack, useDisclosure } from "@chakra-ui/core";
import { getComponent, getPageResponseItem } from "services/page-items";
import SurveyPage from "components/shared/SurveyPage";
import { useTable } from "react-table";
import LightHeading from "components/core/LightHeading";

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

const StatsTable = ({ details, results, stats }) => {
  const columns = useMemo(
    () => [
      {
        accessor: "name",
        Cell: ({ value }) => (
          <span
            style={{
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            {value}
          </span>
        ),
      },
      {
        accessor: "value",
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      { name: "Response Type", value: details.type },
      {
        name: "Participants",
        value: Object.keys(results).length,
      },
      ...Object.keys(stats.stats).map((name) => ({
        name,
        value: stats.stats[name],
      })),
    ],
    [details, results, stats]
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <table
      css={{
        tableLayout: "fixed",
        width: "100%",
        borderCollapse: "collapse",
      }}
      {...getTableProps()}
    >
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const Stats = ({ page, results }) => {
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

  return (
    <Flex w="100%" align="center" direction="column">
      {/* TODO: maybe we should tab these? */}
      <Flex w="100%">
        {/* Page Preview */}
        <Flex w="50%">
          {/* TODO: props */}
          <SurveyPage />
        </Flex>
        {/* Response Visualisation */}
        <Flex w="50%">{stats.visualizations[0].component}</Flex>
      </Flex>
      <Flex w="100%">
        <StatsTable details={details} results={results} stats={stats} />
      </Flex>
    </Flex>
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
      <LightHeading as="h2" size="lg">
        {survey.name}
      </LightHeading>
      <LightHeading as="h3" size="md">
        Dashboard for {results.published}
      </LightHeading>
      <Flex justify="space-between">
        <LightHeading as="h5" size="sm"></LightHeading>
        <Alert status="info">
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
                  total={results.participants.length}
                  progressData={Object.keys(completionByPage[i]).map((id) => ({
                    complete: completionByPage[i][id],
                  }))}
                  onClick={() => handleCardClick(i)}
                />
              )
          )}
        </Stack>
      )}

      {statsPage && (
        <StandardModal
          {...statsModal}
          header={`Q${statsPage.order} Stats`}
          cancelButton={false}
        >
          TODO
        </StandardModal>
      )}
    </Page>
  );
};

export default Dashboard;
