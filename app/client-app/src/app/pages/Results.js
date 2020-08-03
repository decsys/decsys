import React, { useState, useEffect, useMemo } from "react";
import { useSurvey } from "api/surveys";
import {
  useSurveyInstancesList,
  getInstanceResultsSummary,
  getInstanceResultsFull,
} from "api/survey-instances";
import { exportDateFormat as formatDate } from "services/date-formats";
import { getResultsCsvData, downloadFile } from "services/export";
import download from "downloadjs";
import LightHeading from "components/core/LightHeading";
import {
  Text,
  Flex,
  Select,
  Stack,
  Button,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Grid,
} from "@chakra-ui/core";
import { Page, EmptyState, LoadingIndicator } from "components/core";
import { navigate } from "@reach/router";
import { encode } from "services/instance-id";
import { FaChevronDown } from "react-icons/fa";
import { useTable } from "react-table";
import { isEmpty } from "services/data-structures";
import themes from "themes";

const exportMime = "application/json";

const resultsFilename = (surveyName, instancePublished, resultsGenerated) =>
  `${surveyName}_Instance-${formatDate(Date.parse(instancePublished)).flat}_${
    formatDate(Date.parse(resultsGenerated)).flat
  }`;

const Heading = ({ name }) => (
  <LightHeading p={2} mb={4} as="h2" size="lg">
    {name} Results
  </LightHeading>
);

const InstanceSelector = ({ surveyId, onChange }) => {
  const { data: unsortedInstances } = useSurveyInstancesList(surveyId);
  const [instances] = useState(
    unsortedInstances.sort(
      (a, b) =>
        new Date(b.published).getTime() - new Date(a.published).getTime()
    )
  );

  const [currentInstance, setCurrentInstance] = useState(instances[0]);
  const handleInstanceChange = (e) => {
    const selectedInstance = instances.find(
      (x) => x.id.toString() === e.target.value
    );
    setCurrentInstance(selectedInstance);
  };

  useEffect(() => {
    onChange && onChange(currentInstance);
  }, [onChange, currentInstance]);

  return (
    <Flex w="350px">
      <Select onChange={handleInstanceChange} value={currentInstance?.id}>
        {instances.map((x) => (
          <option key={x.id} value={x.id}>
            {formatDate(Date.parse(x.published)).flat}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const DashboardButton = ({ surveyId, instanceId }) => (
  <Button
    isLoading={!instanceId}
    colorScheme="green"
    onClick={() =>
      instanceId &&
      navigate(`/admin/survey/dashboard/${encode(surveyId, instanceId)}`)
    }
  >
    Dashboard
  </Button>
);

const ExportResultsMenu = ({ surveyId, instanceId, results }) => {
  const handleExportCsvClick = async () => {
    const data = getResultsCsvData(results);
    download(data, `${resultsFilename()}_Summary.csv`, "text/csv");
  };

  const handleExportSummaryClick = () =>
    downloadFile(
      [JSON.stringify(results)],
      `${resultsFilename()}_Summary.json`,
      exportMime
    );

  const handleExportFullClick = async () => {
    const { data } = await getInstanceResultsFull(surveyId, instanceId);
    downloadFile(
      [JSON.stringify(data)],
      `${resultsFilename()}_Full.json`,
      exportMime
    );
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        borderColor="gray.400"
        borderWidth={1}
        rightIcon={<FaChevronDown />}
      >
        Export to file...
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleExportCsvClick}>
          Response Summary (CSV)
        </MenuItem>
        <MenuItem onClick={handleExportSummaryClick}>
          Response Summary (JSON)
        </MenuItem>
        <MenuItem onClick={handleExportFullClick}>
          Full Event Log (JSON)
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const ResultsTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <Flex mx={2}>
      <table
        css={{
          tableLayout: "fixed",
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: themes.shadows.callout,
        }}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((group) => (
            <tr
              css={{
                background: "#575757",
              }}
              {...group.getHeaderGroupProps()}
            >
              {group.headers.map((column) => {
                const width =
                  {
                    Page: "60px",
                    Order: "60px",
                    "Page Loaded (UTC)": "200px",
                    "Recorded (UTC)": "200px",
                  }[column.Header] ?? "auto";
                return (
                  <th
                    css={{
                      width,
                      color: "#FFFFFF",
                      textAlign: "center",
                    }}
                    {...column.getHeaderProps()}
                  >
                    {column.render("Header")}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                css={{
                  ":nth-of-type(2n)": {
                    background: "#eeeeee",
                    "& td:nth-of-type(2n)": {
                      background: "#dddddd",
                    },
                  },
                  ":nth-of-type(2n+1)": {
                    "& td:nth-of-type(2n)": {
                      background: "#eeeeee",
                    },
                  },
                }}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td
                    css={{
                      padding: "0 8px",
                      //border: "thin solid #bbb",
                    }}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Flex>
  );
};

const DateTimeCellRender = ({ value }) => {
  const formatted = formatDate(value);

  return (
    <Grid columnGap={2} templateColumns="1fr 1fr">
      <Text textAlign="center" fontWeight="bold">
        {formatted.date}
      </Text>
      <Text textAlign="center">{formatted.time}</Text>
    </Grid>
  );
};

const ResultsTables = ({ results }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Page",
        accessor: "page",
      },
      {
        Header: "Order",
        accessor: "order",
      },
      {
        Header: "Page Loaded (UTC)",
        accessor: (d) => Date.parse(d.pageLoad),
        Cell: DateTimeCellRender,
      },
      {
        id: "nullableResponse",
        Header: "Response",
        Cell: ({ value }) =>
          typeof value === "string" ? (
            <Flex w="100%" justify="center">
              {value}
            </Flex>
          ) : (
            <Grid columnGap={2} templateColumns="1fr 1fr">
              {Object.keys(value).map((key) => [
                <Text key={`${key}_key`} textAlign="right" fontWeight="bold">
                  {key}:
                </Text>,
                <Text key={`${key}_val`}>{JSON.stringify(value[key])}</Text>,
              ])}
            </Grid>
          ),
        accessor: (d) =>
          isEmpty(d.response) ? "- not recorded -" : d.response,
      },
      {
        id: "nullableResponseRecorded",
        Header: "Recorded (UTC)",
        accessor: (d) =>
          isEmpty(d.response)
            ? "- not recorded -"
            : Date.parse(d.responseRecorded),
        Cell: ({ value }) =>
          typeof value === "string" ? (
            <Flex w="100%" justify="center">
              {value}
            </Flex>
          ) : (
            <DateTimeCellRender value={value} />
          ),
      },
    ],
    []
  );

  const [selectedParticipant, setSelectedParticipant] = useState(
    results.participants[0]
  );
  useEffect(() => {
    setSelectedParticipant(results.participants[0]);
  }, [results.participants]);

  const handleSelectionChange = (e) =>
    setSelectedParticipant(
      results.participants.find((x) => x.id.toString() === e.target.value)
    );

  return (
    <>
      <Stack
        mx={2}
        direction="row"
        align="center"
        p={2}
        bg="gray.200"
        borderRadius={8}
      >
        <LightHeading as="h5" size="sm">
          Select a Participant:
        </LightHeading>

        <Flex w="350px">
          <Select
            size="sm"
            value={selectedParticipant.id}
            onChange={handleSelectionChange}
          >
            {results.participants.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id}
              </option>
            ))}
          </Select>
        </Flex>

        <Text>({results.participants.length} total)</Text>
      </Stack>

      <ResultsTable data={selectedParticipant.responses} columns={columns} />

      <Flex>Pagination</Flex>
    </>
  );
};

const Results = ({ id }) => {
  const { data: survey } = useSurvey(id);

  const [currentInstance, setCurrentInstance] = useState();
  const handleInstanceChange = (instance) => setCurrentInstance(instance);

  const [results, setResults] = useState();
  useEffect(() => {
    if (currentInstance) {
      (async () => {
        const { data } = await getInstanceResultsSummary(
          currentInstance.survey.id,
          currentInstance.id
        );
        setResults(data);
      })();
    }
  }, [currentInstance]);

  return (
    <Page layout="results">
      <Flex direction="column" p={2}>
        <Heading name={survey.name} />

        <Flex p={4} bg="gray.100" borderRadius={8} direction="column">
          <Text as="div" mb={1}>
            Select an instance of this Survey to view the results for
          </Text>

          <Flex justifyContent="space-between">
            <InstanceSelector surveyId={id} onChange={handleInstanceChange} />
            <Stack direction="row">
              <DashboardButton surveyId={id} instanceId={currentInstance?.id} />
              <ExportResultsMenu
                surveyId={id}
                instanceId={currentInstance?.id}
                results={results}
              />
            </Stack>
          </Flex>
        </Flex>
      </Flex>

      {results?.participants.length ? (
        <ResultsTables results={results} />
      ) : (
        <Flex mt={4} gridRow="span 3">
          <EmptyState message="There are no results available for this Survey Instance" />
        </Flex>
      )}
    </Page>
  );
};

export default Results;
