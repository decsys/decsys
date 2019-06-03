import React, { useState, useEffect } from "react";
import {
  Container,
  ConfirmModal,
  FlexBox,
  ProgressCard,
  useModal
} from "../../../components/ui";
import AppBar from "../../../components/AppBar";
import { Typography, Box, Alert } from "@smooth-ui/core-sc";
import { InfoCircle, ExclamationTriangle } from "styled-icons/fa-solid";
import {
  getComponent,
  getResponseComponent
} from "../../../utils/component-utils";
import ReactTable from "react-table";
import { useInterval } from "../../../utils/hooks";
import * as api from "../../../api";
import SurveyPageBody from "../../../components/SurveyPage/Body";

const DashboardScreen = ({ instanceId, survey, results: initialResults }) => {
  const statsModal = useModal();
  const [statsPage, setStatsPage] = useState();

  const getDataByPage = results => {
    const resultsByPage = results.participants.reduce((a, p) => {
      p.responses.forEach(r => {
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
      completionByPage
    };
  };

  // refresh data every 10 seconds
  const [results, setResults] = useState(initialResults);
  const [{ resultsByPage, completionByPage }, setDataByPage] = useState(
    getDataByPage(initialResults)
  );
  useInterval(async () => {
    const { data: results } = await api.getInstanceResultsSummary(
      survey.id,
      instanceId
    );
    setResults(results);
    setDataByPage(getDataByPage(results));
  }, 5000);

  const getStatsComponent = () => {
    if (!statsPage) return null;
    if (
      !resultsByPage[statsPage.order] ||
      !Object.keys(resultsByPage[statsPage.order]).length
    ) {
      return (
        <Alert variant="warning" width={1}>
          <ExclamationTriangle size="1em" /> There is no data for this question
          yet.
        </Alert>
      );
    }
    const details = getResponseComponent(statsPage.components);
    const component = getComponent(details.type);
    const statsFn =
      component.stats ||
      (() => ({ visualizations: [{ component: null }], stats: [] }));

    const stats = statsFn(
      { ...component.defaultProps, ...details.params },
      Object.keys(resultsByPage[statsPage.order]).map(
        pid => resultsByPage[statsPage.order][pid]
      )
    );

    const keyStyle = {
      fontWeight: "bold",
      textAlign: "right"
    };

    const columns = [
      {
        accessor: "name",
        Cell: ({ value }) => <span style={keyStyle}>{value}</span>
      },
      {
        accessor: "value"
      }
    ];

    const data = [
      { name: "Response Type", value: details.type },
      {
        name: "Participants",
        value: Object.keys(resultsByPage[statsPage.order]).length
      },
      ...Object.keys(stats.stats).map(name => ({
        name,
        value: stats.stats[name]
      }))
    ];

    const nop = () => {};

    return (
      <FlexBox width={1} flexDirection="column" alignItems="center">
        <FlexBox width={1}>
          <Box width="50%">
            <SurveyPageBody
              id={survey.id}
              components={statsPage.components}
              setNextEnabled={nop}
              logEvent={nop}
            />
          </Box>
          <Box width="50%">{stats.visualizations[0].component}</Box>
        </FlexBox>
        <Box width={1}>
          <ReactTable
            minRows={1}
            data={data}
            columns={columns}
            showPagination={false}
          />
        </Box>
      </FlexBox>
    );
  };

  const handleCardClick = i => {
    setStatsPage(survey.pages[i]);
    statsModal.toggleModal();
  };

  return (
    <>
      <AppBar brand="DECSYS" />
      <Container>
        <Typography my={2} variant="h2">
          {survey.name}
        </Typography>
        <Typography mb={2} variant="h3">
          Dashboard for {results.instance}
        </Typography>
        <Typography mb={2} variant="h5">
          Participant progress by Question
        </Typography>
        <Typography as="div" color="info" mb={2}>
          <InfoCircle size="1em" /> Click a Question's card for more details.
        </Typography>
        {survey.pages.map(
          (p, i) =>
            !!getResponseComponent(p.components) && (
              <ProgressCard
                key={i}
                title={`Q${i + 1}`}
                total={results.participants.length}
                progressData={Object.keys(completionByPage[i]).map(id => ({
                  complete: completionByPage[i][id]
                }))}
                onClick={() => handleCardClick(i)}
              />
            )
        )}
      </Container>
      {statsPage && (
        <ConfirmModal
          maxWidth={900}
          cancelButton={false}
          header={`Q${statsPage.order} Stats`}
          {...statsModal}
        >
          {getStatsComponent()}
        </ConfirmModal>
      )}
    </>
  );
};

export default DashboardScreen;
