import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";

export const CopyableTextPanel = ({ label, value }) => {
  const [copyButton, setCopyButton] = useState({
    leftIcon: <FaCopy />,
    children: "Copy",
  });
  const onCopyClick = () => {
    navigator.clipboard.writeText(value);
    setCopyButton({
      leftIcon: <FaCheck />,
      children: "Copied!",
    });
  };

  return (
    <InputGroup>
      {label && (
        <InputLeftAddon>
          <Text fontWeight="bold">{label}</Text>
        </InputLeftAddon>
      )}
      <Input variant="filled" readOnly value={value} />
      <InputRightElement w="5rem">
        <Button
          colorScheme="blue"
          size="sm"
          h="1.75rem"
          {...copyButton}
          onClick={onCopyClick}
        />
      </InputRightElement>
    </InputGroup>
  );
};
