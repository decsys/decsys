import { useCallback, useState } from "react";
import { validateYupSchema } from "formik";
import { getValidationSchema } from "../../external-types";
import {
  Stack,
  Grid,
  useColorMode,
  Flex,
  Heading,
  Collapse,
  useDisclosure,
  Icon,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ActiveIndicator } from "components/core";
import SurveyInfoLine from "./SurveyInfoLine";
import ActionButtons, { getActionButtons } from "./ActionButtons";
import { listMatchingKeys } from "services/data-structures";
import { encode } from "services/instance-id";
import ManageSurveyMenu from "./ManageSurveyMenu";
import ActiveInstanceLine from "./ActiveInstanceLine";
import { SurveyProvider, useSurvey } from "../../../../contexts/Survey";
import themes, { defaultColorMode } from "themes";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import AddSurveyModal from "../AddSurveyModal";
import { archiveSurvey, unarchiveSurvey } from "api/surveys";

const SurveyCard = () => {
  const { onToggle, isOpen } = useDisclosure();
  const addSurveyModal = useDisclosure();

  const { colorMode } = useColorMode();
  const style = themes.sharedStyles.card;
  const survey = useSurvey();
  const {
    id,
    activeInstanceId,
    runCount,
    parentSurveyId,
    isStudy,
    children,
    type,
    settings,
    archivedDate: initialArchivedDate,
  } = survey;
  const [currentArchiveDate, setCurrentArchiveDate] =
    useState(initialArchivedDate);
  const friendlyId = !!activeInstanceId ? encode(id, activeInstanceId) : "";

  const validateSettings = useCallback(() => {
    if (!type) return true;
    try {
      // check settings validity
      validateYupSchema(settings, getValidationSchema(type), true);
      return true;
    } catch (e) {
      return false;
    }
  }, [settings, type]);

  const actionButtons = getActionButtons(
    survey,
    validateSettings(),
    currentArchiveDate
  );
  const toast = useToast();

  const handleArchive = async () => {
    try {
      await archiveSurvey(id);
      setCurrentArchiveDate(new Date().toISOString());
      toast({
        title: "Survey Archived",
        description: "The survey was successfully archived.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error Archiving Survey",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveSurvey(id);
      setCurrentArchiveDate(null);
      toast({
        title: "Survey Unarchived",
        description: "The survey was successfully unarchived.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error Unarchiving Survey",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0}
        {...style[colorMode || defaultColorMode]}
      >
        {!parentSurveyId && (
          <ActiveIndicator
            active={!!activeInstanceId}
            archived={!!currentArchiveDate}
          />
        )}

        <Stack spacing={0} w="100%">
          <Grid
            borderBottom={
              (!parentSurveyId && activeInstanceId) || isStudy
                ? "thin solid"
                : "none"
            }
            borderColor={style[colorMode || defaultColorMode].borderColor}
            gap={2}
            templateColumns={`16px ${!parentSurveyId ? "80px" : ""} 1fr ${
              parentSurveyId && friendlyId ? "auto" : ""
            } ${Array(listMatchingKeys(actionButtons).length)
              .fill("100px")
              .join(" ")} auto`}
            p={parentSurveyId ? 1 : 2}
            alignContent="center"
          >
            <SurveyInfoLine
              {...survey}
              friendlyId={friendlyId}
              areSettingsValid={validateSettings()}
            />

            <ActionButtons
              actionButtons={actionButtons}
              {...survey}
              currentArchiveDate={currentArchiveDate}
              friendlyId={friendlyId}
            />

            <ManageSurveyMenu
              {...survey}
              editable={!runCount && !isStudy}
              isStudy={isStudy}
              areSettingsValid={validateSettings()}
              activeInstanceId={activeInstanceId}
              currentArchiveDate={currentArchiveDate}
              handleUnarchive={handleUnarchive}
              handleArchive={handleArchive}
            />
          </Grid>

          {!parentSurveyId && activeInstanceId && (
            <Stack
              borderBottom={isStudy ? "thin solid" : "none"}
              borderColor={style[colorMode || defaultColorMode].borderColor}
            >
              <ActiveInstanceLine friendlyId={friendlyId} {...survey} />
            </Stack>
          )}

          {isStudy && (
            <Stack spacing={0} bg="gray.200">
              <Flex justify="space-between" p={1}>
                <Stack
                  flexGrow={1}
                  direction="row"
                  spacing={1}
                  align="center"
                  onClick={children?.length && onToggle}
                  cursor={children?.length && "pointer"}
                >
                  {children?.length && (
                    <Icon as={isOpen ? FaChevronDown : FaChevronRight} />
                  )}
                  <Heading p={1.5} size="sm" fontWeight="medium">
                    Child Surveys ({children?.length ?? 0})
                  </Heading>
                </Stack>
                {!runCount && (
                  <Button
                    leftIcon={<FaPlus />}
                    size="sm"
                    colorScheme="green"
                    variant="outline"
                    onClick={addSurveyModal.onOpen}
                  >
                    Add a Survey
                  </Button>
                )}
              </Flex>
              <Collapse in={children?.length && isOpen} animateOpacity>
                <Stack p={children?.length ? 2 : 0} pt={0}>
                  <Stack spacing={0} shadow="callout">
                    {children?.map((x) => (
                      <SurveyProvider key={x.id} value={x}>
                        <SurveyCard />
                      </SurveyProvider>
                    ))}
                  </Stack>
                </Stack>
              </Collapse>
            </Stack>
          )}
        </Stack>
      </Stack>

      <AddSurveyModal
        modalState={addSurveyModal}
        parent={{ id, type, settings }}
      />
    </>
  );
};

export default SurveyCard;
