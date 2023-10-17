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
    id: "PreviewParticipant",
    surveyStarted: new Date(),
    responses: [],
  });

  const handleClick = async () => {
    // you'd think busy state in preview wouldn't be worth it

    setIsBusy(true);

    // but in practice it resets scrolling between different page content ;)
    // as long as it takes a non "zero" amount of time
    await new Promise((resolve) => setTimeout(resolve, 100));

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
