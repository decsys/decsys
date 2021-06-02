import { useState, useEffect } from "react";
import { Page, StandardModal } from "components/core";
import SurveyPage from "components/shared/SurveyPage";
import { useSurvey } from "api/surveys";
import { navigate } from "@reach/router";
import {
  Alert,
  AlertIcon,
  Button,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const navigateBack = (location) =>
  navigate(location?.state?.backRedirect ?? `/admin`);

const Preview = ({ id, location }) => {
  const {
    data: { pages, settings },
  } = useSurvey(id);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => setLastPage(page === pages.length - 1), [page, pages.length]);
  const confirmRedirectModal = useDisclosure();

  const handleClick = () => {
    if (lastPage) {
      if (settings?.CompletionUrl) confirmRedirectModal.onOpen();
      else return navigateBack(location);
    } else {
      setPage(page + 1);
    }
  };

  return (
    <Page layout="preview">
      <SurveyPage
        surveyId={id}
        page={pages[page]}
        lastPage={lastPage}
        handleNextClick={handleClick}
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
