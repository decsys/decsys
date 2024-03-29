import { Box, Badge, Heading, Button, Icon, Stack } from "@chakra-ui/react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { ActiveIndicator } from "components/core";

export const WordCard = ({
  type,
  word,
  isExcludedBuiltin,
  onToggleExclude,
}) => {
  return (
    <Stack spacing={0} direction="row" bg="gray.200">
      <ActiveIndicator active={!isExcludedBuiltin} />
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
              onClick={() => onToggleExclude(word, type, isExcludedBuiltin)}
              leftIcon={
                isExcludedBuiltin ? <FaPlusCircle /> : <FaMinusCircle />
              }
              bg={isExcludedBuiltin ? "blue.500" : "red.500"}
              color="white"
              _hover={{
                bg: isExcludedBuiltin ? "blue.600" : "red.600",
              }}
            >
              {isExcludedBuiltin ? "Unblock" : "Block"}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};
