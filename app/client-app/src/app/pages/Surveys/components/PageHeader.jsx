import { Flex, Button, Stack, Tooltip } from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";

export const PageHeader = ({ addSurveyAction, addStudyAction }) => {
  return (
    <>
      <Flex my={8} align="center" justify="space-between">
        <LightHeading as="h1" size="xl">
          My Surveys
        </LightHeading>
        <Stack direction="row">
          <Tooltip
            hasArrow
            label={
              <Flex textAlign="center">
                A Study is a container, which randomises participants into
                multiple child Surveys
              </Flex>
            }
          >
            <Button
              colorScheme="green"
              variant="outline"
              leftIcon={<FaPlusCircle />}
              onClick={addStudyAction}
            >
              Add a Study
            </Button>
          </Tooltip>

          <Button
            colorScheme="green"
            leftIcon={<FaPlusCircle />}
            onClick={addSurveyAction}
          >
            Add a Survey
          </Button>
        </Stack>
      </Flex>
    </>
  );
};
