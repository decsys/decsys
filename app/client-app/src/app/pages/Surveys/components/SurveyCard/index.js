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

const SurveyCard = () => {
  const { onToggle, isOpen } = useDisclosure();
  const addSurveyModal = useDisclosure();

  const { colorMode } = useColorMode();
  const style = themes.sharedStyles.card;
  const survey = useSurvey();
  const { id, activeInstanceId, runCount, parentSurveyId, isStudy, children } =
    survey;
  const friendlyId = !!activeInstanceId ? encode(id, activeInstanceId) : "";

  const actionButtons = getActionButtons(survey);

  return (
    <>
      <Stack
        direction="row"
        spacing={0}
        {...style[colorMode || defaultColorMode]}
      >
        {!parentSurveyId && <ActiveIndicator active={!!activeInstanceId} />}

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
            <SurveyInfoLine {...survey} friendlyId={friendlyId} />

            <ActionButtons
              actionButtons={actionButtons}
              {...survey}
              friendlyId={friendlyId}
            />

            <ManageSurveyMenu {...survey} editable={!runCount} />
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
                  <Heading size="sm" fontWeight="medium">
                    Child Surveys ({children?.length ?? 0})
                  </Heading>
                </Stack>
                <Button
                  leftIcon={<FaPlus />}
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  onClick={addSurveyModal.onOpen}
                >
                  Add a Survey
                </Button>
              </Flex>
              <Collapse in={isOpen} animateOpacity>
                <Stack p={2}>
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

      <AddSurveyModal modalState={addSurveyModal} parentId={id} />
    </>
  );
};

export default SurveyCard;
