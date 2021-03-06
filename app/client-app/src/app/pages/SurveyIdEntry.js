import { useState } from "react";
import { navigate } from "@reach/router";
import { Page } from "components/core";
import { Flex, Icon, Input, Button } from "@chakra-ui/react";
import { FaList } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";

const SurveyIdEntry = () => {
  const [id, setId] = useState();

  const handleChange = ({ target: { value } }) => setId(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/survey/${id}`);
  };

  return (
    <Page>
      <Flex
        direction="column"
        w="100%"
        align="center"
        justify="center"
        pt={100}
      >
        <Flex w="250px">
          <Icon as={FaList} boxSize="100%" />
        </Flex>

        <LightHeading as="h2" size="lg" mb={3}>
          Please enter a Survey ID to participate
        </LightHeading>
        <form onSubmit={handleSubmit}>
          <Flex>
            <Input
              size="lg"
              placeholder="Survey ID"
              onChange={handleChange}
              mr={2}
            />
            <Button colorScheme="blue" size="lg" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Flex>
    </Page>
  );
};

export default SurveyIdEntry;
