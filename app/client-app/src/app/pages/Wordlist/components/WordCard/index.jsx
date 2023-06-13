import React from "react";
import { Box, Badge, Heading, Button, Icon } from "@chakra-ui/react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

// WordCard component
export const WordCard = ({ type, word, isExcluded }) => {
  const handleAction = () => {
    if (isExcluded) {
      // Unblock the word
    } else {
      // Block the word
    }
  };

  return (
    <Box
      backgroundColor="gray.200"
      padding="10px"
      marginBottom="10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center" // Ensure children items are aligned to center
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
          colorScheme={isExcluded ? "red" : "green"}
        >
          {isExcluded ? "Unblock" : "Block"}
        </Button>
      </Box>
    </Box>
  );
};
