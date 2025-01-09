import {
  Flex,
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  MenuDivider,
} from "@chakra-ui/react";
import { FaChevronDown, FaFolder } from "react-icons/fa";
import { AiOutlineGroup } from "react-icons/ai";
import { RiSurveyLine } from "react-icons/ri";
import LightHeading from "components/core/LightHeading";

export const PageHeader = ({
  addSurveyAction,
  addStudyAction,
  addFolderAction,
}) => {
  return (
    <>
      <Flex my={8} align="center" justify="space-between">
        <LightHeading as="h1" size="xl">
          My Surveys
        </LightHeading>
        <VStack align="end">
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="green"
              rightIcon={<FaChevronDown />}
            >
              Create New
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaFolder />} onClick={addFolderAction}>
                Create Folder
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<RiSurveyLine />} onClick={addSurveyAction}>
                Add a Survey
              </MenuItem>
              <Tooltip
                hasArrow
                label={
                  <Flex textAlign="center">
                    A Study is a container, which randomises participants into
                    multiple child Surveys
                  </Flex>
                }
              >
                <MenuItem icon={<AiOutlineGroup />} onClick={addStudyAction}>
                  Add a Study
                </MenuItem>
              </Tooltip>
            </MenuList>
          </Menu>
        </VStack>
      </Flex>
    </>
  );
};
