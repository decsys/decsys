import React, { useState, useEffect } from "react";
import { Container, FlexBox } from "../../components/ui";
import AppBar from "../../components/AppBar";
import { Typography, Select, Alert, Button, Box } from "@smooth-ui/core-sc";
import { InfoCircle, Download } from "styled-icons/fa-solid";
import * as api from "../../api";
import ReactTable from "react-table";
import { Grid } from "styled-css-grid";

// TODO: move this somewhere reusable?
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const formatDate = date =>
  new Intl.DateTimeFormat("en-GB", {
    // TODO: better locale?
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: false
  }).format(date);

const ResultsScreen = ({ instances: initialInstances, survey }) => {
  const [instances, setInstances] = useState(
    initialInstances.sort((a, b) => a.published - b.published)
  );

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

  const handleExportClick = () => {
    const file = new Blob([JSON.stringify(results)], {
      type: "application/json"
    });
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = `Instance-${formatDate(
      Date.parse(currentInstance.published)
    )}_${formatDate(Date.parse(results.generated))}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
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
          <Button variant="secondary" onClick={handleExportClick}>
            <Download size="1em" /> Export to file...
          </Button>
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
      accessor: "page" // String-based value accessors!
    },
    {
      Header: "Order",
      accessor: "order"
      //Cell: props => <span className="number">{props.value}</span> // Custom cell components!
    },
    {
      Header: "Page Loaded",
      accessor: "pageLoad",
      Cell: ({ value }) => <span>{formatDate(Date.parse(value))}</span> // Custom cell components!
    },
    {
      id: "nullableResponse", // Required because our accessor is not a string
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
              <Typography key={`${key}_val`}>{value[key]}</Typography>
            ])}
          </Grid>
        ),
      accessor: d => (isEmpty(d.response) ? "- not recorded -" : d.response) //d => d.friend.name // Custom value accessors!
    },
    {
      id: "nullableResponseRecorded",
      Header: "Recorded",
      accessor: d =>
        isEmpty(d.response)
          ? "- not recorded -"
          : formatDate(Date.parse(d.responseRecorded)) //d => d.friend.name // Custom value accessors!
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

/**
 * So here's the plan.
 *
 * - Navi route can pull the Instances for a single Survey
 * - Results Screen keeps the instances in state
 * - Results Screen has a dropdown for instances, ordered and displayed by published date
 * - Selecting an instance from the dropdown causes a loading state managed by the screen
 *   not by Navi
 * - loads instance results summary
 * - renders it in a basic table
 * - enables export button which simply stringifies the results data as returned from the API
 *   and writes it to a file where the user wants.
 */

export default ResultsScreen;
