import { useState } from "react";
import { Icon, Stack, Text } from "@chakra-ui/react";
import { FaExclamationTriangle } from "react-icons/fa";
import StandardModal from "components/core/StandardModal";

const DeleteFolderModal = ({ modalState, name, onConfirm }) => {
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
      header="Delete Folder"
      confirmButton={{
        colorScheme: "red",
        children: "Delete folder",
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
          This will remove the folder, including all contents and data
          associated with it.
        </Text>
      </Stack>
    </StandardModal>
  );
};

export default DeleteFolderModal;
