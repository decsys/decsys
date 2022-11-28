import { useState } from "react";
import { Stack, Text, Icon } from "@chakra-ui/react";
import StandardModal from "components/core/StandardModal";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteSurveyModal = ({ modalState, name, onConfirm, isStudy }) => {
  const entityName = isStudy ? "Study" : "Survey";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
  };

  return (
    <StandardModal
      size="lg"
      {...modalState}
      header={`Delete ${entityName}`}
      confirmButton={{
        colorScheme: "red",
        children: `Delete ${entityName.toLocaleLowerCase()}`,
        onClick: handleDelete,
        disabled: isSubmitting,
        isLoading: isSubmitting,
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
          This will remove the {entityName.toLocaleLowerCase()}, including all
          configuration and results data associated with it
          {isStudy && " AND ANY CHILD SURVEYS"}.
        </Text>
      </Stack>
    </StandardModal>
  );
};

export default DeleteSurveyModal;
