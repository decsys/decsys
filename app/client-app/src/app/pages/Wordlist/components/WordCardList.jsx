import { WordCard } from "./WordCard";
import { Stack } from "@chakra-ui/react";

export const WordCardList = ({ cards }) => {
  return (
    <Stack borderColor="gray.200" boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;">
      {cards.map((card, index) => (
        <WordCard key={index} {...card} />
      ))}
    </Stack>
  );
};
