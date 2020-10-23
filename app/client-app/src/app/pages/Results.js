import React, { useState, useEffect, useMemo } from "react";
import { useSurvey } from "api/surveys";
import {
  useSurveyInstancesList,
  getInstanceResultsSummary,
  getInstanceResultsFull,
} from "api/survey-instances";
import {
  dateTimeOffsetStringComparer,
  exportDateFormat as formatDate,
} from "services/date-formats";
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
  useTheme,
  Icon,
} from "@chakra-ui/core";
import { Page, EmptyState, LoadingIndicator } from "components/core";
import { navigate } from "@reach/router";
import { encode } from "services/instance-id";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTable, useSortBy, useFilters } from "react-table";
import { isEmpty } from "services/data-structures";

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
  const filename = useMemo(
    () =>
      results &&
      resultsFilename(
        results.survey,
        results.published,
        results.exportGenerated
      ),
    [results]
  );

  const handleExportCsvClick = async () => {
    const data = getResultsCsvData(results);
    download(data, `${filename}_Summary.csv`, "text/csv");
  };

  const handleExportSummaryClick = () =>
    downloadFile(
      [JSON.stringify(results)],
      `${filename}_Summary.json`,
      exportMime
    );

  const handleExportFullClick = async () => {
    const { data } = await getInstanceResultsFull(surveyId, instanceId);
    downloadFile([JSON.stringify(data)], `${filename}_Full.json`, exportMime);
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

const ResultsTable = ({ columns, data, page, participant }) => {
  const filters = useMemo(() => {
    const result = [];
    if (page) result.push({ id: "page", value: page });
    if (participant) result.push({ id: "participant", value: participant });
    console.log(result);
    return result;
  }, [page, participant]);

  const hiddenColumns = useMemo(() => {
    const result = [];
    if (page) result.push("page");
    if (participant) result.push("participant");
    return result;
  }, [page, participant]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
    setAllFilters,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        filters,
        hiddenColumns,
      },
    },
    useFilters,
    useSortBy
  );

  const { colors } = useTheme();

  useEffect(() => {
    setHiddenColumns(hiddenColumns);
  }, [hiddenColumns, setHiddenColumns]);

  useEffect(() => {
    setAllFilters(filters);
  }, [filters, setAllFilters]);

  return (
    <Flex overflowY="auto">
      <table
        css={{
          position: "relative",
          tableLayout: "fixed",
          width: "100%",
          borderCollapse: "collapse",
        }}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((group) => (
            <tr {...group.getHeaderGroupProps()}>
              {group.headers.map((column) => {
                const width =
                  {
                    Page: "100px",
                    Order: "100px",
                    "Page Loaded (UTC)": "200px",
                    "Recorded (UTC)": "200px",
                  }[column.Header] ?? "auto";
                return (
                  <th
                    css={{
                      background: colors.gray[600],
                      position: "sticky",
                      top: 0,
                      width,
                      color: colors.white,
                      textAlign: "center",
                      borderLeft: "thin solid white",
                      borderRight: "thin solid white",
                    }}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    {column.isSorted && (
                      <Flex
                        w="100%"
                        justify="flex-end"
                        position="absolute"
                        top={0}
                        left={0}
                        py={1}
                        px={2}
                      >
                        <Icon
                          as={column.isSortedDesc ? FaChevronDown : FaChevronUp}
                        />
                      </Flex>
                    )}
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
                    background: colors.gray[200],
                    "& td:nth-of-type(2n)": {
                      background: colors.gray[300],
                    },
                  },
                  ":nth-of-type(2n+1)": {
                    background: colors.gray[100],
                    "& td:nth-of-type(2n)": {
                      background: colors.gray[200],
                    },
                  },
                }}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td
                    css={{
                      padding: "0 8px",
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

const SELECT_ALL_KEY = "All";

const ResultsTables = ({ results }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Page",
        accessor: "page",
        filter: "equals",
      },
      {
        Header: "Participant",
        accessor: "participant",
        filter: "equals",
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
        Header: "Response Type",
        accessor: "responseType",
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

  // we actually flatten the results data
  // and let react-table do filtering based on the selection UI here
  const tableData = useMemo(
    () =>
      results.participants.reduce(
        (data, p) => [
          ...data,
          ...p.responses.map((r) => ({ participant: p.id, ...r })),
        ],
        []
      ),
    [results.participants]
  );

  const [selectedPage, setSelectedPage] = useState(null);

  const [selectedParticipant, setSelectedParticipant] = useState(
    results.participants[0]?.id
  );
  useEffect(() => {
    setSelectedParticipant(results.participants[0]?.id);
    setSelectedPage(null);
  }, [results.participants]);

  const handleParticipantChange = (e) => {
    setSelectedParticipant(
      e.target.value === SELECT_ALL_KEY ? null : e.target.value
    );
  };

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
            value={selectedParticipant ?? SELECT_ALL_KEY}
            onChange={handleParticipantChange}
          >
            <option key={`__${SELECT_ALL_KEY}__`} value={SELECT_ALL_KEY}>
              {SELECT_ALL_KEY}
            </option>
            {results.participants.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id}
              </option>
            ))}
          </Select>
        </Flex>

        <Text>({results.participants.length} total)</Text>
      </Stack>

      <ResultsTable
        data={tableData}
        columns={columns}
        participant={selectedParticipant}
        page={selectedPage}
      />
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
        data.participants = data.participants.sort((a, b) =>
          dateTimeOffsetStringComparer(a.surveyStarted, b.surveyStarted)
        );
        setResults(data);
      })();
    }
  }, [currentInstance]);

  let resultsArea = <LoadingIndicator verb="Fetching" noun="results" />;
  if (results) {
    if (results.participants.length)
      resultsArea = <ResultsTables results={results} />;
    else
      resultsArea = (
        <Flex mt={4} gridRow="span 2">
          <EmptyState message="There are no results available for this Survey Instance" />
        </Flex>
      );
  }

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

      {resultsArea}
    </Page>
  );
};

export default Results;
