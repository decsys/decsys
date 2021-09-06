import {
  Collapse,
  Flex,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import SurveyCard from "./SurveyCard";
import { SurveyProvider } from "../../../contexts/Survey";

export const StudyCard = ({ id, surveys }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex
      bg="gray.200"
      borderRadius={10}
      direction="column"
      transition="height 2s ease"
    >
      <Flex p={2} onClick={onToggle} cursor="pointer">
        <Heading fontWeight="medium">My Study</Heading>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {isOpen && (
          <Stack p={2} spacing={0}>
            {surveys?.map((x) => (
              <SurveyProvider key={x.id} value={x}>
                <SurveyCard />
              </SurveyProvider>
            ))}
          </Stack>
        )}
      </Collapse>
    </Flex>
  );
};
