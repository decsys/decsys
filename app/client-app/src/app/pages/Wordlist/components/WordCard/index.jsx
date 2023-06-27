import { Box, Badge, Heading, Button, Icon, Stack } from "@chakra-ui/react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { ActiveIndicator } from "components/core";
import { fetchWordList } from "api/wordlist";
import { excludeBuiltinWords } from "api/wordlist";
import { includeBuiltinWords } from "api/wordlist";

export const WordCard = ({ type, word, isExcluded }) => {
  const handleAction = async () => {
    setIsBlocked(!isExcluded);
    const data = await fetchWordList();
    const id = data.id;

    if (isExcluded) {
      await includeBuiltinWords(id, type, word);
    } else {
      await excludeBuiltinWords(id, type, word);
    }
  };

  return (
    <Stack spacing={0} direction="row" bg="gray.200">
      <ActiveIndicator active={isExcluded ? false : true} />
      <Stack w="100%">
        <Box
          backgroundColor="gray.100"
          padding="10px"
          marginBottom="1px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex="1">
            <Heading size="md">{word}</Heading>
          </Box>
          <Box flex="1" display="flex" justifyContent="center">
            <Badge
              variant="subtle"
              colorScheme="blue"
              padding="5px"
              fontSize="l"
              fontWeight="bold"
            >
              {type}
            </Badge>
          </Box>
          <Box flex="1" display="flex" justifyContent="flex-end">
            <Button
              onClick={handleAction}
              leftIcon={isExcluded ? <FaPlusCircle /> : <FaMinusCircle />}
              bg={isExcluded ? "blue.500" : "red.500"}
              color="white"
              _hover={{
                bg: isExcluded ? "blue.600" : "red.600",
              }}
            >
              {isExcluded ? "Unblock" : "Block"}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};
