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

export const CopyableTextPanel = ({
  label,
  value,
  hideCopyButton,
  buttonScheme = "gray",
}) => {
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

    setTimeout(
      () =>
        setCopyButton({
          leftIcon: <FaCopy />,
          children: "Copy",
        }),
      2000
    );
  };

  return (
    <InputGroup>
      {label && (
        <InputLeftAddon>
          <Text fontWeight="bold">{label}</Text>
        </InputLeftAddon>
      )}
      <Input variant="filled" readOnly value={value} />
      {!hideCopyButton && (
        <InputRightElement w="5rem">
          <Button
            colorScheme={buttonScheme}
            size="sm"
            h="1.75rem"
            {...copyButton}
            transition="linear .1s content"
            onClick={onCopyClick}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
};
