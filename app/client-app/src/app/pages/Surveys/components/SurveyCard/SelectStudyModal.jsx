import { useState } from "react";
import {
  Stack,
  Box,
  useRadio,
  useRadioGroup,
  Heading,
  Flex,
  Grid,
  useColorMode,
  Badge,
  Tooltip,
  Icon,
  Text,
  Alert,
  AlertIcon,
  Input,
  HStack,
} from "@chakra-ui/react";
import themes, { defaultColorMode } from "themes";
import { FaArrowDown, FaInfoCircle } from "react-icons/fa";
import StandardModal from "components/core/StandardModal";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";
import { navigate } from "@reach/router";
import { useSurveysList } from "api/surveys";
import FilterControls from "../Pagination/PaginationControls";
import SortPanel from "components/shared/SortPanel";
import { useDebounce } from "app/pages/Editor/components/Helpers/useDebounce";

function RadioCard({ children, ...p }) {
  const { getInputProps, getCheckboxProps } = useRadio(p);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        _checked={{
          bg: "blue.100",
        }}
        _focus={{
          boxShadow: "outline",
          clipPath: "inset(-5px)",
        }}
        {...p}
      >
        {children}
      </Box>
    </Box>
  );
}

const SelectableStudyCard = ({ study, ...p }) => {
  const { colorMode } = useColorMode();
  const style = themes.sharedStyles.card;
  const { name, children, type, hasInvalidExternalLink } = study;

  return (
    <RadioCard {...p} bg={style[colorMode || defaultColorMode].bg}>
      <Stack direction="row" spacing={0}>
        <Stack spacing={0} w="100%">
          <Grid
            borderBottom="thin solid"
            borderColor={style[colorMode || defaultColorMode].borderColor}
            gap={2}
            templateColumns={`80px 1fr 150px`}
            p={2}
            alignItems="center"
          >
            <Flex align="center" justifyContent="center">
              <Badge
                w="100%"
                textAlign="center"
                colorScheme={
                  !!type ? (hasInvalidExternalLink ? "red" : "yellow") : "cyan"
                }
                variant="solid"
                py={1}
                title={
                  hasInvalidExternalLink
                    ? "Another DECSYS Survey has the same type and external ID."
                    : ""
                }
              >
                {type ?? "Standard"}
              </Badge>
            </Flex>

            <Heading size="sm" fontWeight="medium">
              {name}
            </Heading>

            <Tooltip
              label={
                children?.length ? (
                  <Stack spacing={0}>
                    {children.map((x) => (
                      <Flex key={x.id}>{x.name}</Flex>
                    ))}
                  </Stack>
                ) : (
                  ""
                )
              }
            >
              <Heading size="xs" fontWeight="medium">
                <Stack direction="row" align="center">
                  <Icon as={FaInfoCircle} />
                  <Text>Child Surveys ({children?.length ?? 0})</Text>
                </Stack>
              </Heading>
            </Tooltip>
          </Grid>
        </Stack>
      </Stack>
    </RadioCard>
  );
};

const NoneCard = (p) => {
  const { colorMode } = useColorMode();
  const style = themes.sharedStyles.card;
  return (
    <RadioCard
      p={2}
      bg={style[colorMode || defaultColorMode].bg}
      borderBottom="thin solid"
      borderColor={style[colorMode || defaultColorMode].borderColor}
      {...p}
    >
      <Heading size="sm" fontWeight="medium">
        None
      </Heading>
    </RadioCard>
  );
};

export const StudySelectList = ({
  defaultValue = "none",
  surveys,
  onChange,
  totalCount,
  pageIndex,
  setPageIndex,
  pageSize,
  sortBy,
  setSortBy,
  direction,
  setDirection,
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "targetStudy",
    defaultValue,
    onChange,
  });

  const group = getRootProps();
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleSortButtonClick = (key) => {
    if (sortBy === key) {
      setDirection((prev) => (prev === "up" ? "down" : "up"));
    } else {
      setSortBy(key);
      setDirection("up");
    }
    setPageIndex(0);
  };

  return (
    <Stack mt={2}>
      <HStack justifyContent="space-between">
        <HStack>
          <Text mr=".5em" display={{ xs: "none", md: "inline" }}>
            Sort by:
          </Text>
          <SortPanel
            state={{ key: sortBy, [sortBy]: direction === "up" }}
            keys={["Name"]}
            onSortButtonClick={handleSortButtonClick}
          />
        </HStack>
      </HStack>
      <Stack boxShadow="callout" spacing={0} {...group}>
        <NoneCard {...getRadioProps({ value: "none" })} />
        {surveys.map(({ id }) => {
          const survey = surveys.find((survey) => survey.id === id);
          if (!survey || !survey.isStudy || survey.runCount) return null;

          const radio = getRadioProps({ value: id.toString() });

          return <SelectableStudyCard key={id} study={survey} {...radio} />;
        })}
      </Stack>
      <Flex justifyContent="end" pt="2">
        <FilterControls
          totalItems={totalCount}
          totalPages={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
        />
      </Flex>
    </Stack>
  );
};

export const SelectStudyModal = ({ id, name, parentId, modalState, ...p }) => {
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("up");

  const { data, mutateSurveys } = useSurveysList(
    "",
    "unarchived",
    sortBy,
    direction,
    true,
    true,
    pageIndex,
    pageSize
  );

  const surveys = data.surveys;
  const totalCount = data.studyTotalCount;

  const { changeStudy } = useSurveyCardActions(navigate, mutateSurveys);
  const [selectedStudyId, setSelectedStudyId] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (value) =>
    setSelectedStudyId(value !== "none" ? value : null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await changeStudy(id, selectedStudyId);
    setIsSubmitting(false);
    modalState.onClose();
  };

  return (
    <StandardModal
      {...modalState}
      size="2xl"
      header="Change Parent Study"
      confirmButton={{
        colorScheme: "blue",
        children: "Save",
        onClick: handleSubmit,
        disabled: isSubmitting,
        isLoading: isSubmitting,
      }}
      {...p}
    >
      <Stack w="100%">
        <Stack w="100%" align="center">
          <Text>
            <strong>Survey: </strong>
            {name}
          </Text>
          <Icon as={FaArrowDown} />
          <Text>
            <strong>Parent: </strong>
            {selectedStudyId ? surveys.name : "None"}
          </Text>
        </Stack>

        <Alert status="info">
          <AlertIcon />
          <Stack spacing={0}>
            <Text as="p">
              Select a valid Study from below to move this Survey to,
            </Text>
            <Text as="p">
              or choose <strong>None</strong> to make it a standalone Survey.
            </Text>
          </Stack>
        </Alert>

        <StudySelectList
          surveys={surveys}
          defaultValue={parentId?.toString()}
          onChange={handleChange}
          totalCount={totalCount}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          sortBy={sortBy}
          setSortBy={setSortBy}
          direction={direction}
          setDirection={setDirection}
        />
      </Stack>
    </StandardModal>
  );
};
