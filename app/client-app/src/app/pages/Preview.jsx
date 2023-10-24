import { useState, useEffect, useRef } from "react";
import { Page, StandardModal } from "components/core";
import SurveyPage from "components/shared/SurveyPage";
import { useChildList, useSurvey } from "api/surveys";
import { navigate } from "@reach/router";
import {
  Alert,
  AlertIcon,
  Button,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { pickRandomItem } from "services/randomizer";
import { getPageResponseItem } from "services/page-items";
import { isBuiltIn } from "services/page-items";
import { encode } from "services/instance-id";
import { previewWebhook } from "api/webhooks";
import { PAGE_NAVIGATION } from "constants/event-types";

const navigateBack = (location) =>
  navigate(location?.state?.backRedirect ?? `/admin/`);

const pickRandomChildOrDefault = (parentId, childIds = []) =>
  childIds.length ? pickRandomItem(childIds) : parentId;

const usePreviewSurvey = (surveyId) => {
  // first try and get children in case the surveyId is for a Study
  const { data: children } = useChildList(surveyId);

  const targetId = useRef(
    pickRandomChildOrDefault(
      surveyId,
      children.map((x) => x.id)
    ),
    [surveyId]
  );

  // then get the survey for either a randomly picked child,
  // or the survey itself if it has no children
  const {
    data: { parent, pages, settings },
  } = useSurvey(targetId.current);

  // finally, use parent settings if we have a parent
  return {
    pages,
    settings: parent?.settings ?? settings,
    targetId: targetId.current,
  };
};

const Preview = ({ id, location }) => {
  // Preview uses a Survey's Page List directly
  // it can't use progress as there is no participant
  const { targetId, pages, settings } = usePreviewSurvey(id);

  // It therefore has to maintain its own progress state
  // with regards to page order, and position
  // TODO: consider adding randomisation
  const [page, setPage] = useState(0);
  const [isBusy, setIsBusy] = useState();
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => setLastPage(page === pages.length - 1), [page, pages.length]);
  const confirmRedirectModal = useDisclosure();

  const [participantSummary, setParticipantSummary] = useState({
    Id: "PreviewParticipant",
    SurveyStarted: new Date(),
    Responses: [],
  });

  const logEvent = (source, type, payload) => {
    const pageResponseItem = getPageResponseItem(pages[page].components);

    if (type === "decsys.platform.PAGE_LOAD") {
      // Check if a response item exists for the current page
      if (pageResponseItem) {
        // Find the item marked as IsQuestionItem
        let questionItem = pages[page].components.find((x) => x.isQuestionItem);
        let questionContent = null;

        // If there's a question item, try to get content from it
        if (questionItem) {
          questionContent = questionItem.params.text;
        }
        // If no question item was found, then check for a built-in content item
        else {
          questionItem = pages[page].components.find((x) => isBuiltIn(x.type));
          if (questionItem) {
            questionContent = questionItem.params.text;
          }
        }

        setParticipantSummary((prevState) => ({
          ...prevState,
          Responses: [
            ...prevState.Responses,
            {
              Page: pages[page].order,
              PageName: pages[page].name,
              Question: questionContent,
              ResponseType: pageResponseItem.type,
              Order: pages[page].order,
              PageLoad: new Date(),
              IsOptional: pageResponseItem.isOptional,
            },
          ],
        }));
      }
    } else if (type == "decsys.platform.COMPONENT_RESULTS") {
      const relavantPage = pages.find((p) =>
        p.components.some((c) => c.id === source)
      );
      const pageIndex = relavantPage?.order - 1;
      if (pageIndex > -1) {
        setParticipantSummary((prevState) => {
          let updatedResponses = [...prevState.Responses];
          updatedResponses[pageIndex] = {
            ...updatedResponses[pageIndex],
            Response: payload,
            ResponseRecorded: new Date(),
          };
          return {
            ...prevState,
            Responses: updatedResponses,
          };
        });
      }
    }
  };

  const handleClick = async () => {
    // you'd think busy state in preview wouldn't be worth it

    setIsBusy(true);

    // but in practice it resets scrolling between different page content ;)
    // as long as it takes a non "zero" amount of time
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Encode the surveyId
    const encodedSurveyId = encode(targetId) + "za";

    // Compute ResolvedSuccess
    const resolvedSuccess = page >= 0 && page < pages.length;

    const webhookData = {
      ParticipantId: "PreviewParticipant",
      SurveyId: encodedSurveyId,
      Timestamp: new Date().toISOString(),
      EventType: {
        SourcePage: page + 1,
        TargetPage: page,
        ResolvedPage: page + 2,
        ResolvedSuccess: resolvedSuccess,
        Name: PAGE_NAVIGATION,
      },
      Payload: participantSummary,
    };

    try {
      // Call the API with the webhook model
      const { status, data } = await previewWebhook(webhookData);

      switch (status) {
        case 200:
          console.log(data);
          break;
        case 204:
          console.error("Webhook would not be triggered.");
          break;
        case 400:
          console.error("Invalid request payload.");
          break;
        default:
          console.error(`Unexpected status code: ${status}`);
      }
    } catch (e) {
      console.error(e);
    }

    if (lastPage) {
      if (settings?.CompletionUrl) confirmRedirectModal.onOpen();
      else return navigateBack(location);
    } else {
      setPage(page + 1);
    }

    setIsBusy(false);
  };

  return (
    <Page layout="preview">
      <SurveyPage
        surveyId={targetId}
        page={pages[page]}
        lastPage={lastPage}
        handleNextClick={handleClick}
        isBusy={isBusy}
        logEvent={logEvent}
      />
      <ConfirmRedirectModal
        modalState={confirmRedirectModal}
        completionUrl={settings?.CompletionUrl}
        location={location}
      />
    </Page>
  );
};

const ConfirmRedirectModal = ({ modalState, completionUrl, location }) => {
  return (
    <StandardModal
      {...modalState}
      header="Completion Redirect"
      cancelButton={false}
      showCloseButton={false}
    >
      <Stack spacing={2}>
        <Alert status="info">
          <AlertIcon />

          <Stack>
            <Text>This Survey has a Completion Redirect URL configured.</Text>
            <Text>You may want to follow it to test it works as expected.</Text>
          </Stack>
        </Alert>
        <Text fontWeight="bold">What would you like to do?</Text>
        <Button
          colorScheme="green"
          mb={1}
          onClick={() => navigate(completionUrl)}
        >
          Follow the configured URL
        </Button>
        <Button
          colorScheme="blue"
          mb={1}
          onClick={() => navigateBack(location)}
        >
          Return to Survey Admin
        </Button>
      </Stack>
    </StandardModal>
  );
};

export default Preview;
