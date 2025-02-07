import { useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  AlertTitle,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import StandardModal from "components/core/StandardModal";

const DeleteFolderModal = ({ modalState, name, onConfirm, surveyCount }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (surveyCount === 0) {
      setIsSubmitting(true);
      try {
        await onConfirm();
        toast({
          title: "Folder deleted",
          description: "The folder was successfully deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        modalState.onClose();
      } catch (error) {
        toast({
          title: "Error Deleting Folder",
          description: "An error occurred while deleting the folder.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isDisabled = surveyCount !== 0 || isSubmitting;

  return (
    <StandardModal
      size="md"
      {...modalState}
      header="Delete Folder"
      confirmButton={{
        colorScheme: "red",
        children: "Delete folder",
        onClick: handleDelete,
        disabled: isDisabled,
        isLoading: isSubmitting,
      }}
    >
      {surveyCount > 0 ? (
        <Alert status="warning">
          <VStack>
            <HStack>
              <AlertIcon />
              <AlertTitle>
                Cannot delete Folder as it contains {surveyCount}{" "}
                {surveyCount === 1 ? `Survey` : `Surveys`}.
              </AlertTitle>
            </HStack>
            <AlertDescription fontSize="sm">
              Please remove the {surveyCount === 1 ? `survey` : `surveys`}{" "}
              contained within this folder or relocate them to another folder to
              enable its deletion.
            </AlertDescription>
          </VStack>
        </Alert>
      ) : (
        <Text>
          Are you sure you want to delete the folder{" "}
          <Text as="span" fontWeight="bold">
            {name}
          </Text>
          ?
        </Text>
      )}
    </StandardModal>
  );
};

export default DeleteFolderModal;
