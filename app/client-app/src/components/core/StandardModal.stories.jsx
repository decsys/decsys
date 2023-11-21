import StandardModal from "./StandardModal";
import { Text, Flex } from "@chakra-ui/react";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

/* eslint-disable-next-line */
export default {
  title: "Core UI/StandardModal",
  component: StandardModal,
  argTypes: {
    onOpen: { action: "Modal opened" },
    onClose: { action: "Modal closed" },
    onToggle: { action: "Modal toggled" },
    onDelete: { action: "Delete clicked" },
  },
};

export const Basic = (args) => (
  <StandardModal {...args} isOpen={true}>
    Hello there!
  </StandardModal>
);

export const NoCancel = (args) => (
  <StandardModal {...args} isOpen={true} cancelButton={false} header="Oops!">
    <Text>Some information here...</Text>
  </StandardModal>
);

export const NoCloseButton = (args) => (
  <StandardModal {...args} isOpen={true} showCloseButton={false} header="Oops!">
    Some information here...
  </StandardModal>
);

export const CustomButtons = (args) => (
  <StandardModal
    {...args}
    isOpen={true}
    header={
      <Flex alignItems="center" color="danger">
        <FaExclamationTriangle size="1em" />
        <Text ml={1}>Delete stuff?</Text>
      </Flex>
    }
    cancelButton={{
      content: (
        <Flex alignItems="center">
          <FaArrowLeft size="1em" />
          <Text ml={1}>Go back</Text>
        </Flex>
      ),
      colorScheme: "green",
    }}
    confirmButton={{
      children: "Delete",
      colorScheme: "red",
      onClick: args.onDelete,
    }}
  >
    Are you sure?
  </StandardModal>
);
