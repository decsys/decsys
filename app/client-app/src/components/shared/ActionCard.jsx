import { Heading, HStack, Icon, Box, VStack } from "@chakra-ui/react";

export const ActionCard = ({ icon, title, href, children, ...p }) => (
  <VStack
    bg="gray.100"
    borderColor="gray.300"
    borderWidth={2}
    borderRadius={5}
    h="100%"
    p={4}
    align="stretch"
    {...p}
  >
    <HStack>
      {icon && <Icon as={icon} />}
      <Box w="100%">
        <Heading as="h3" size="md">
          {title}
        </Heading>
      </Box>
    </HStack>
    {children}
  </VStack>
);
