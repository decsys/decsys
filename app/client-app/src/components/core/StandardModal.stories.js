import { action } from "@storybook/addon-actions";
import StandardModal from "./StandardModal";
import { Text, Flex } from "@chakra-ui/react";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

export default {
  title: "Core UI/StandardModal",
  component: StandardModal,
  argTypes: {
    onOpen: { action: "Modal opened" },
    onClose: { action: "Modal closed" },
    onToggle: { action: "Modal toggled" },
  },
  args: {
    isOpen: true,
  },
};

const Template = (args) => <StandardModal {...args} />;

export const Basic = Template.bind({});
Basic.args = { children: "Hello there!" };

export const NoCancel = Template.bind({});
NoCancel.args = {
  cancelButton: false,
  header: "Oops!",
  children: <Text>Some information here...</Text>,
};

export const NoCloseButton = Template.bind({});
NoCloseButton.args = {
  ...NoCancel.args,
  cancelButton: undefined,
  showCloseButton: false,
};

export const CustomButtons = Template.bind({});
CustomButtons.args = {
  header: (
    <Flex alignItems="center" color="danger">
      <FaExclamationTriangle size="1em" />
      <Text ml={1}>Delete stuff?</Text>
    </Flex>
  ),
  cancelButton: {
    content: (
      <Flex alignItems="center">
        <FaArrowLeft size="1em" />
        <Text ml={1}>Go back</Text>
      </Flex>
    ),
    colorScheme: "green",
  },
  confirmButton: {
    children: "Delete",
    colorScheme: "red",
    onClick: action("Delete clicked"),
  },
  children: "Are you sure?",
};
