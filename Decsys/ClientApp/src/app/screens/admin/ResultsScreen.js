import React, { useState, useEffect } from "react";
import {
  Container,
  FlexBox,
  DropdownMenuButton,
  MenuItem
} from "../../components/ui";
import AppBar from "../../components/AppBar";
import { Typography, Select, Box } from "@smooth-ui/core-sc";
import * as api from "../../api";
import ReactTable from "react-table";
import { Grid } from "styled-css-grid";
import { exportDateFormat as formatDate } from "../../utils/date-formats";
import download from "downloadjs";

// TODO: move this somewhere reusable?
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const ResultsScreen = ({ instances: initialInstances, survey }) => {
  const [instances] = useState(
    initialInstances.sort((a, b) => a.published - b.published)
  );

  const exportMime = "application/json";

  const [currentInstance, setCurrentInstance] = useState(instances[0]);

  const [results, setResults] = useState();
  useEffect(() => {
    // TODO: check if main list needs a refresh, or if the results do...
    const fetch = async () => {
      const { data } = await api.getInstanceResultsSummary(
        currentInstance.survey.id,
        currentInstance.id
      );
      setResults(data);
    };
    fetch();
  }, [currentInstance]);

  const handleExportSummaryClick = () => {
    const file = new Blob([JSON.stringify(results)], {
      type: exportMime
    });
    download(
      file,
      `${survey.name}_Instance-${formatDate(
        Date.parse(currentInstance.published)
      )}_${formatDate(Date.parse(results.generated))}.json`,
      exportMime
    );
  };

  const handleExportFullClick = async () => {
    const { data } = await api.getInstanceResultsFull(
      survey.id,
      currentInstance.id
    );

    const file = new Blob([JSON.stringify(data)], {
      type: exportMime
    });

    download(
      file,
      `${survey.name}_Instance-${formatDate(
        Date.parse(currentInstance.published)
      )}_${formatDate(Date.parse(results.generated))}.json`,
      exportMime
    );
  };

  const handleInstanceChange = e => {
    setCurrentInstance(instances.find(x => x.id.toString() === e.target.value));
  };

  return (
    <>
      <AppBar brand="DECSYS" />
      <Container>
        <Typography my={2} variant="h2">
          {survey.name}
        </Typography>
        <Typography mb={2} variant="h3">
          Results
        </Typography>
        <Typography as="div" mb={1}>
          Select an instance of this Survey to view the results for
        </Typography>
        <FlexBox justifyContent="space-between">
          <Select
            mr={1}
            onChange={handleInstanceChange}
            value={currentInstance.id}
          >
            {instances.map(x => (
              <option key={x.id} value={x.id}>
                {formatDate(Date.parse(x.published))}
              </option>
            ))}
          </Select>
          <DropdownMenuButton variant="secondary" button="Export to file...">
            <MenuItem onClick={handleExportSummaryClick}>
              Response Summary (JSON)
            </MenuItem>
            <MenuItem onClick={handleExportFullClick}>
              Full Event Log (JSON)
            </MenuItem>
          </DropdownMenuButton>
        </FlexBox>
        {results && <Results results={results} />}
      </Container>
    </>
  );
};

const Results = ({ results }) => {
  const columns = [
    {
      Header: "Page",
      accessor: "page"
    },
    {
      Header: "Order",
      accessor: "order"
    },
    {
      Header: "Page Loaded",
      accessor: "pageLoad",
      Cell: ({ value }) => <span>{formatDate(Date.parse(value))}</span>
    },
    {
      id: "nullableResponse",
      Header: "Response",
      Cell: ({ value }) =>
        typeof value === "string" ? (
          <Box textAlign="center">{value}</Box>
        ) : (
          <Grid columns="1fr 1fr">
            {Object.keys(value).map(key => [
              <Typography
                key={`${key}_key`}
                textAlign="right"
                fontWeight="bold"
              >
                {key}:
              </Typography>,
              <Typography key={`${key}_val`}>
                {JSON.stringify(value[key])}
              </Typography>
            ])}
          </Grid>
        ),
      accessor: d => (isEmpty(d.response) ? "- not recorded -" : d.response)
    },
    {
      id: "nullableResponseRecorded",
      Header: "Recorded",
      accessor: d =>
        isEmpty(d.response)
          ? "- not recorded -"
          : formatDate(Date.parse(d.responseRecorded))
    }
  ];

  return (
    <>
      {results.participants.map(x => (
        <div key={x.id}>
          <Typography mt={2} variant="h5">
            Participant: {x.id}
          </Typography>
          <ReactTable minRows={1} data={x.responses} columns={columns} />
        </div>
      ))}
    </>
  );
};

export default ResultsScreen;
