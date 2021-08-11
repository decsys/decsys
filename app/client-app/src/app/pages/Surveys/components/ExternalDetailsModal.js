import { StandardModal } from "components/core";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { capitalise } from "services/strings";
import LightHeading from "components/core/LightHeading";
import { CopyableTextPanel } from "components/core/CopyableTextPanel";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";

const Definition = ({ term, definition, isInline }) => {
  const render = (
    <>
      <Text fontWeight="bold">{term}</Text>
      <Text pl={2}>{definition}</Text>
    </>
  );

  return isInline ? <Flex>{render}</Flex> : render;
};

const ExternalDetailsModal = ({
  modalState,
  settings,
  name,
  type,
  hasInvalidExternalLink,
}) => {
  if (!type) return null;

  // TODO: will this ever differ by survey type?
  const externalSurveyUrl = `${window.location.origin.replace(
    "localhost",
    "<ip-address>"
  )}/survey`;

  return (
    <StandardModal
      size="xl"
      {...modalState}
      header={`Survey details`}
      cancelButton={false}
    >
      <Stack w="100%" spacing={2} mb={3}>
        <Stack w="100%" pl={2}>
          <CopyableTextPanel label="Survey Name" value={name} />

          {externalSurveyUrl?.includes("<ip-address>") && (
            <Alert status="warning">
              <AlertIcon />

              <Text as="div" className="markdown-body">
                <ReactMarkdown
                  source={`
Since you're running in **Workshop Mode**, you'll need to provide
an ip address where your machine can access DECSYS, such as
\`127.0.0.1\`
            `}
                />
              </Text>
            </Alert>
          )}
          <CopyableTextPanel label="Survey URL" value={externalSurveyUrl} />
        </Stack>

        <LightHeading size="md">{capitalise(type)} Settings</LightHeading>
        <Stack w="100%" pl={2}>
          {hasInvalidExternalLink && (
            <Alert status="warning">
              <AlertIcon />
              <Stack>
                <AlertTitle>This Survey's external link is broken</AlertTitle>
                <AlertDescription>
                  Another newer DECSYS Survey was created with the same External
                  Survey ID, breaking the link to this Survey.
                </AlertDescription>
              </Stack>
            </Alert>
          )}
          {Object.keys(settings).map((k) => (
            <CopyableTextPanel key={k} label={k} value={settings[k]} />
          ))}
        </Stack>
      </Stack>
    </StandardModal>
  );
};
export { ExternalDetailsModal };
