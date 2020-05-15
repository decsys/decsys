import React, { useEffect } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Spinner,
  useToast
} from "@chakra-ui/core";
import { FaEdit } from "react-icons/fa";
import { useEditorBarContext } from "../../contexts/EditorBar";
import useFreshPropState from "hooks/useFreshPropState";
import useDeferredAction from "hooks/useDeferredAction";

const NameInput = ({ name }) => {
  const toast = useToast();
  const { saveName, nameState } = useEditorBarContext();
  const [value, setValue] = useFreshPropState(name);

  const deferredSave = useDeferredAction(saveName);
  const handleChange = ({ target: { value } }) => {
    setValue(value);
    deferredSave(value);
  };

  useEffect(() => {
    if (nameState.hasSaved === true)
      toast({
        position: "top",
        title: "Name saved.",
        status: "success",
        duration: 2500,
        isClosable: true
      });
  }, [nameState.hasSaved, toast]);

  return (
    <Flex align="center" width="100%" px={2}>
      <InputGroup color="white" width="100%">
        <InputLeftElement>
          {nameState.isSaving ? <Spinner /> : <Box as={FaEdit} />}
        </InputLeftElement>
        <Input
          color="white"
          variant="flushed"
          borderRadius={0}
          size="lg"
          fontSize="1.3rem"
          placeholder="Untitled Survey"
          value={value}
          onChange={handleChange}
        />
      </InputGroup>
    </Flex>
  );
};

export default NameInput;
