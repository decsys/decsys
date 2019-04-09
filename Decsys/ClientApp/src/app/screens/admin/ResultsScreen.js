import React, { useState, useEffect } from "react";
import { Container, FlexBox, EmptyState } from "../../components/ui";
import AppBar from "../../components/AppBar";
import { Typography, Select, Alert, Button } from "@smooth-ui/core-sc";
import { InfoCircle, Download } from "styled-icons/fa-solid";
import * as api from "../../api";

// TODO: move this somewhere reusable?
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const ResultsScreen = ({ instances: initialInstances, survey }) => {
  const [instances, setInstances] = useState(
    initialInstances.sort((a, b) => a.published - b.published)
  );

  const [currentInstance, setCurrentInstance] = useState();
  useEffect(() => {
    setCurrentInstance(instances[0]);
  }, []);

  const [results, setResults] = useState();
  useEffect(() => {
    if (!currentInstance) return;
    // TODO: check if main list needs a refresh, or if the results do...
    (async () => {
      const { data } = await api.getInstanceResultsSummary(
        currentInstance.survey.id,
        currentInstance.id
      );
      setResults(data);
    })();
  }, [currentInstance]);

  const handleExportClick = () => {
    const file = new Blob([JSON.stringify(results)], {
      type: "application/json"
    });
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "export"; // TODO: proper filename
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const handleInstanceChange = id => {
    setCurrentInstance(instances.find(x => x.id === id));
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
        <Alert variant="info">
          <InfoCircle size="1em" /> Please note that the time format of all
          timestamps are aligned to the time settings on the server device.
        </Alert>
        <Typography as="div" mb={1}>
          Select an instance of this Survey to view the results for
        </Typography>
        <FlexBox justifyContent="space-between">
          <Select
            mr={1}
            onChange={e => handleInstanceChange(e.target.value)}
            value={currentInstance}
          >
            {instances.map(x => (
              <option key={x.id} value={x.id}>
                {x.published}
              </option>
            ))}
          </Select>
          <Button onClick={handleExportClick}>
            <Download size="1em" /> Export to file...
          </Button>
        </FlexBox>
        {results && <Results results={results} />}
      </Container>
    </>
  );
};

const Results = ({ results }) => {
  return (
    <div>
      {results.participants.map(x => (
        <div key={x.id}>
          <Typography mt={2} variant="h5">
            Participant: {x.id}
          </Typography>
          <table>
            <thead>
              <tr>
                <th>Page</th>
                <th>Order</th>
                <th>Loaded</th>
                <th>Response</th>
                <th>Recorded</th>
              </tr>
            </thead>
            <tbody>
              {x.responses.map(r => (
                <tr>
                  <td>{r.page}</td>
                  <td>{r.order}</td>
                  <td>{r.pageLoad}</td>
                  <td>
                    {isEmpty(r.response)
                      ? "<not recorded>"
                      : JSON.stringify(r.response)}
                  </td>
                  <td>
                    {isEmpty(r.response)
                      ? "<not recorded>"
                      : r.responseRecorded}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
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
