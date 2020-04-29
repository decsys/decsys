import React from "react";
import { action } from "@storybook/addon-actions";
import StandardModal from "./StandardModal";
import { Text, Flex } from "@chakra-ui/core";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const modalState = {
  isOpen: true,
  onOpen: action("Modal opened"),
  onClose: action("Modal closed"),
  onToggle: action("Modal toggled")
};

export default {
  title: "Core UI/StandardModal",
  component: StandardModal
};

export const Basic = () => <StandardModal {...modalState} />;

export const NoCancel = () => (
  <StandardModal {...modalState} cancelButton={false} header="Oops!">
    <Text pb={5}>Some information here...</Text>
  </StandardModal>
);

export const NoCloseButton = () => (
  <StandardModal {...modalState} showCloseButton={false} header="Oops!">
    Some information here...
  </StandardModal>
);

export const CustomButtons = () => (
  <StandardModal
    header={
      <Flex alignItems="center" color="danger">
        <FaExclamationTriangle size="1em" />
        <Text ml={1}>Delete stuff?</Text>
      </Flex>
    }
    {...modalState}
    cancelButton={{
      content: (
        <Flex alignItems="center">
          <FaArrowLeft size="1em" />
          <Text ml={1}>Go back</Text>
        </Flex>
      ),
      variantColor: "green"
    }}
    confirmButton={{
      content: "Delete",
      variantColor: "red",
      onClick: action("Delete clicked")
    }}
  >
    Are you sure?
  </StandardModal>
);
