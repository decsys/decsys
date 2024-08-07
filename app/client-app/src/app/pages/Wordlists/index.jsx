import { useState, useEffect } from "react";
import { Box, Flex, Button, Heading, Link } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { listWordlist } from "api/wordlist";
import { Page } from "components/core";
import LightHeading from "components/core/LightHeading";
import CreateWordlistModal from "./component/CreateWordlistModel";
import { ActionCard } from "components/shared/ActionCard";
import { Link as RouterLink } from "@reach/router";

const Wordlists = () => {
  const [wordLists, setWordLists] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const getWordLists = async () => {
      const results = await listWordlist();
      setWordLists(results);
    };
    getWordLists();
  }, []);

  const openCreateModal = () => setCreateModalOpen(true);

  return (
    <Page>
      <Flex justifyContent="space-between" alignItems="center" px="2" py="4">
        <LightHeading as="h1" size="xl">
          My Wordlists
        </LightHeading>
        <Button
          leftIcon={<FaPlus />}
          size="md"
          colorScheme="green"
          onClick={openCreateModal}
        >
          Create a Wordlist
        </Button>
      </Flex>
      {wordLists.map((wordlist) => (
        <Box p={2} key={wordlist.id}>
          <ActionCard
            title={
              <Link as={RouterLink} to={`${wordlist.id}`}>
                <Heading as="h4" size="md" wordBreak="break-all">
                  {wordlist.name}
                </Heading>
              </Link>
            }
          />
        </Box>
      ))}

      <CreateWordlistModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onAddWordList={setWordLists}
      />
    </Page>
  );
};

export default Wordlists;
