import React from "react";
import { Stack, Flex, Text } from "@chakra-ui/core";
import StandardModal from "components/core/StandardModal";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteSurveyModal = ({ modalState, name, onConfirm }) => (
  <StandardModal
    size="lg"
    {...modalState}
    header="Delete Survey"
    confirmButton={{
      variantColor: "red",
      content: "Delete survey",
      onClick: onConfirm
    }}
  >
    <Flex as={FaExclamationTriangle} fontSize="5em" color="red.500" />
    <Stack gap={2} flexDirection="column" ml={4}>
      <Text>
        Are you sure you want to delete{" "}
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        ?
      </Text>
      <Text as="p" color="red.500">
        This will remove the survey, including all configuration and results
        data associated with it.
      </Text>
    </Stack>
  </StandardModal>
);

export default DeleteSurveyModal;
