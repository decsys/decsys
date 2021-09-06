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

const ExternalTypeInfo = ({ type, settings, hasInvalidExternalLink }) => {
  switch (type) {
    case "prolific":
      return (
        <>
          <Text fontWeight="bold">Prolific Study ID:</Text>
          <Text>{settings.StudyId}</Text>

          {hasInvalidExternalLink && (
            <Stack
              display={{ base: "none", xl: "inherit" }}
              title="Another DECSYS Survey has the same type and external ID."
            >
              <Alert variant="left-accent" status="warning" py={1}>
                <AlertIcon />
                Broken external link!
              </Alert>
            </Stack>
          )}
        </>
      );
    default:
      return null;
  }
};

export const RespondentCountBadge = ({ friendlyId }) => {
  const [results, setResults] = useState({});
  useEffect(() => {
    (async () => {
      const [surveyId, instanceId] = decode(friendlyId);
      const { data } = await getInstanceResultsSummary(surveyId, instanceId);
      setResults(data);
    })();
  }, [friendlyId]);

  return (
    <Badge textAlign="center" colorScheme="cyan" variant="outline" p={1}>
      {results?.participants?.length ?? 0} respondents
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
}) => {
  const instanceValidIdModal = useDisclosure();
  const configModal = useDisclosure();

  return (
    <>
      <Flex align="center" px={2} py={1}>
        <Stack direction="row" alignItems="center">
          <RespondentCountBadge friendlyId={friendlyId} />
          {type ? (
            <ExternalTypeInfo
              type={type}
              settings={settings}
              hasInvalidExternalLink={hasInvalidExternalLink}
            />
          ) : (
            <>
              <Text fontWeight="bold">Survey ID:</Text>
              <Text>{friendlyId}</Text>

              <Divider orientation="vertical" />

              <Text fontWeight="bold">Share Link:</Text>
              <Link
                color="blue.500"
                as={RouterLink}
                to={`/survey/${friendlyId}`}
              >
                /survey/{friendlyId}
              </Link>

              <Stack display={{ base: "none", xl: "inherit" }}>
                <Alert variant="left-accent" status="info" py={1}>
                  <AlertIcon />
                  Remember to include your DECSYS server's address
                </Alert>
              </Stack>
            </>
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
        hasInvalidExternalLink={hasInvalidExternalLink}
        modalState={configModal}
      />
    </>
  );
};

export default ActiveInstanceLine;
