import { Flex, Grid, Text, useColorMode } from "@chakra-ui/react";
import { BarButton } from "app/pages/Editor/components/EditorBar/Buttons";
import { Link } from "@reach/router";
import { FaChevronLeft } from "react-icons/fa";

const BackButton = () => (
  <BarButton as={Link} to="/admin/wordlists" leftIcon={<FaChevronLeft />}>
    Wordlists
  </BarButton>
);

const EditorBar = () => {
  const { colorMode } = useColorMode();
  const bg = { light: "gray.800" };

  return (
    <Grid
      width="100%"
      gap={0}
      templateColumns="auto 1fr auto auto auto auto auto"
      bg={bg[colorMode || defaultColorMode]}
    >
      <BackButton />
      <Flex bg="gray.100" alignItems="center" p="2" fontSize="1.3rem">
        <Text>Default Wordlist</Text>
      </Flex>
    </Grid>
  );
};

export default EditorBar;
