import { useEffect } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { useDerivedState } from "hooks/useDerivedState";
import useDeferredAction from "hooks/useDeferredAction";

const NameInput = ({ name, handleNameSave, nameState, ...p }) => {
  const toast = useToast();
  const [value, setValue] = useDerivedState(name);

  const deferredSave = useDeferredAction(handleNameSave);
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
        isClosable: true,
      });
  }, [nameState.hasSaved, toast]);

  return (
    <Flex align="center" width="100%">
      <InputGroup width="100%" {...p}>
        <InputLeftElement>
          {nameState.isSaving ? <Spinner /> : <Icon as={FaEdit} />}
        </InputLeftElement>
        <Input
          variant="flushed"
          borderRadius={0}
          fontSize="1.3rem"
          placeholder="Untitled"
          value={value}
          onChange={handleChange}
        />
      </InputGroup>
    </Flex>
  );
};

export default NameInput;
