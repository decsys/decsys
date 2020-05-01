import React from "react";
import {
  Text,
  Button,
  AlertIcon,
  Alert,
  Link,
  Stack,
  Divider,
  useDisclosure
} from "@chakra-ui/core";
import { Link as RouterLink } from "@reach/router";
import InstanceValidIdModal from "./InstanceValidIdModal";
import { InstanceFriendlyIdProvider } from "../../contexts/InstanceFriendlyId";

const ActiveInstanceLine = ({ friendlyId }) => {
  const instanceValidIdModal = useDisclosure();

  return (
    <>
      <Stack
        isInline
        p={1}
        alignItems="center"
        borderTop="thin solid"
        borderColor="gray.300"
      >
        <Text fontWeight="bold">Survey ID:</Text>
        <Text>{friendlyId}</Text>

        <Divider orientation="vertical" />

        <Text fontWeight="bold">Share Link:</Text>
        <Link color="blue.500" as={RouterLink} to={`/survey/${friendlyId}`}>
          /survey/{friendlyId}
        </Link>

        <Stack display={{ base: "none", lg: "inherit" }}>
          <Alert variant="left-accent" status="info" py={1}>
            <AlertIcon />
            Remember to include your DECSYS server's address
          </Alert>
        </Stack>

        <Button
          size="sm"
          ml="auto"
          border="thin solid"
          borderColor="cyan.500"
          color="cyan.500"
          onClick={instanceValidIdModal.onOpen}
        >
          View Valid Participant Identifiers
        </Button>
      </Stack>

      <InstanceFriendlyIdProvider value={friendlyId}>
        <InstanceValidIdModal modalState={instanceValidIdModal} />
      </InstanceFriendlyIdProvider>
    </>
  );
};

export default ActiveInstanceLine;
