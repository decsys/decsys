import { StandardModal } from "components/core";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { capitalise } from "services/strings";
import LightHeading from "components/core/LightHeading";
import { CopyableTextPanel } from "components/core/CopyableTextPanel";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";
import { encode } from "services/instance-id";

// This module is where all the type specific stuff in the frontend occurs.
// Everywhere else it is genericised. Hopefully can keep it that way.

/**
 * Build the external survey link based on survey id.
 * In future this may differ based on external type
 * @param {*} id
 * @returns
 */
const getExternalSurveyUrl = (id) =>
  `${window.location.origin.replace(
    "localhost",
    "<ip-address>"
  )}/survey/${encode(id)}`;

/**
 * Provide conditional advice about IP addresses if the URL
 * expects a local ip address
 * @param {*} url
 * @returns
 */
const IpAddressWarning = (url) => {
  console.log(url);
  return url?.includes("<ip-address>") ? (
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
  ) : null;
};

const InvalidExternalLinkAlert = () => (
  <Alert status="warning">
    <AlertIcon />
    <Stack>
      <AlertTitle>This Survey's external link is broken</AlertTitle>
      <AlertDescription>
        Another newer DECSYS Survey was created with the same External Survey
        ID, breaking the link to this Survey.
      </AlertDescription>
    </Stack>
  </Alert>
);

const ExternalDetailsModal = ({
  id,
  modalState,
  settings,
  name,
  type,
  hasInvalidExternalLink,
  runCount,
}) => {
  if (!type) return null;

  const externalSurveyUrl = getExternalSurveyUrl(id);

  return (
    <StandardModal
      size="xl"
      {...modalState}
      header={`Survey details`}
      cancelButton={!runCount}
    >
      <Stack w="100%" spacing={2} mb={3}>
        <Stack w="100%" pl={2}>
          <CopyableTextPanel label="Survey Name" value={name} />

          <IpAddressWarning url={externalSurveyUrl} />
          <CopyableTextPanel label="Access URL" value={externalSurveyUrl} />
        </Stack>

        <LightHeading size="md">{capitalise(type)} Settings</LightHeading>
        <Stack w="100%" pl={2}>
          {hasInvalidExternalLink && <InvalidExternalLinkAlert />}
          {runCount ? (
            Object.keys(settings).map((k) => (
              <CopyableTextPanel key={k} label={k} value={settings[k]} />
            ))
          ) : (
            <div>editable</div>
          )}
        </Stack>
      </Stack>
    </StandardModal>
  );
};
export { ExternalDetailsModal };
