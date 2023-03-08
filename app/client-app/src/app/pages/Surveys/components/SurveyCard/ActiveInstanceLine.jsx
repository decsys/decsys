import { useEffect, useState } from "react";
import {
  Text,
  Button,
  Link,
  Stack,
  Divider,
  useDisclosure,
  Alert,
  AlertIcon,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink } from "@reach/router";
import { capitalise } from "services/strings";
import InstanceValidIdModal from "./InstanceValidIdModal";
import { InstanceFriendlyIdProvider } from "../../contexts/InstanceFriendlyId";
import { decode } from "services/instance-id";
import { getInstanceResultsSummary } from "api/survey-instances";
import { ExternalDetailsModal } from "../ExternalDetailsModal";

const SurveyLinkInfo = ({ friendlyId }) => (
  <>
    <Text fontWeight="bold">Share Link:</Text>
    <Link color="blue.500" as={RouterLink} to={`/survey/${friendlyId}`}>
      /survey/{friendlyId}
    </Link>

    <Stack display={{ base: "none", xl: "inherit" }}>
      <Alert variant="left-accent" status="info" py={1}>
        <AlertIcon />
        Remember to include your DECSYS server's address
      </Alert>
    </Stack>
  </>
);

const ExternalTypeInfo = ({ type, hasInvalidExternalLink }) => {
  switch (type) {
    case "prolific":
      return hasInvalidExternalLink ? (
        <Stack
          display={{ base: "none", xl: "inherit" }}
          title="Another DECSYS Survey has the same type and external ID."
        >
          <Alert variant="left-accent" status="warning" py={1}>
            <AlertIcon />
            Broken external link!
          </Alert>
        </Stack>
      ) : null;
    default:
      return null;
  }
};

const InternalTypeInfo = ({ friendlyId }) => (
  <>
    <Text fontWeight="bold">Survey ID:</Text>
    <Text>{friendlyId}</Text>

    <Divider orientation="vertical" />

    <SurveyLinkInfo friendlyId={friendlyId} />
  </>
);

export const RespondentCountBadge = ({ count, isStudy }) => {
  // TODO: fix for studies
  if (isStudy) return null;

  return (
    <Badge textAlign="center" colorScheme="cyan" variant="outline" p={1}>
      {count ?? 0} respondents
    </Badge>
  );
};

const ActiveInstanceLine = ({
  id,
  name,
  type,
  friendlyId,
  settings,
  hasInvalidExternalLink,
  runCount,
  activeInstanceParticipantCount,
  isStudy,
}) => {
  const instanceValidIdModal = useDisclosure();
  const configModal = useDisclosure();

  return (
    <>
      <Flex align="center" px={2} py={1}>
        <Stack direction="row" alignItems="center">
          <RespondentCountBadge
            count={activeInstanceParticipantCount}
            isStudy={isStudy}
          />
          {type ? (
            <ExternalTypeInfo
              friendlyId={friendlyId}
              type={type}
              settings={settings}
              hasInvalidExternalLink={hasInvalidExternalLink}
            />
          ) : (
            <InternalTypeInfo friendlyId={friendlyId} />
          )}
        </Stack>

        <Button
          size="sm"
          ml="auto"
          border="thin solid"
          borderColor="cyan.500"
          color="cyan.500"
          onClick={type ? configModal.onOpen : instanceValidIdModal.onOpen}
        >
          {type
            ? `View ${capitalise(type)} Survey details`
            : "View Valid Participant Identifiers"}
        </Button>
      </Flex>

      <InstanceFriendlyIdProvider value={friendlyId}>
        <InstanceValidIdModal modalState={instanceValidIdModal} />
      </InstanceFriendlyIdProvider>

      <ExternalDetailsModal
        id={id}
        name={name}
        settings={settings}
        type={type}
        runCount={runCount}
        hasInvalidExternalLink={hasInvalidExternalLink}
        modalState={configModal}
      />
    </>
  );
};

export default ActiveInstanceLine;
