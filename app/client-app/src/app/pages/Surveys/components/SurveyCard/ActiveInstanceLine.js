import React from "react";
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
} from "@chakra-ui/core";
import { Link as RouterLink } from "@reach/router";
import InstanceValidIdModal from "./InstanceValidIdModal";
import { InstanceFriendlyIdProvider } from "../../contexts/InstanceFriendlyId";

const ActiveInstanceLine = ({ friendlyId }) => {
  const instanceValidIdModal = useDisclosure();

  return (
    <>
      <Flex align="center" px={2} py={1}>
        <Stack direction="row" alignItems="center">
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
      </Flex>

      <InstanceFriendlyIdProvider value={friendlyId}>
        <InstanceValidIdModal modalState={instanceValidIdModal} />
      </InstanceFriendlyIdProvider>
    </>
  );
};

export default ActiveInstanceLine;
