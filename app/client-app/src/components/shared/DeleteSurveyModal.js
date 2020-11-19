import React from "react";
import { Stack, Text, Icon } from "@chakra-ui/react";
import StandardModal from "components/core/StandardModal";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteSurveyModal = ({ modalState, name, onConfirm }) => (
  <StandardModal
    size="lg"
    {...modalState}
    header="Delete Survey"
    confirmButton={{
      colorScheme: "red",
      children: "Delete survey",
      onClick: onConfirm,
    }}
  >
    <Icon as={FaExclamationTriangle} fontSize="5em" color="red.500" />
    <Stack spacing={2} ml={4}>
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
