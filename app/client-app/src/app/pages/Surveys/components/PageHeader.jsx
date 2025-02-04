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
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import { FaChevronDown, FaFolder, FaPlusCircle } from "react-icons/fa";
import { AiOutlineGroup } from "react-icons/ai";
import { RiSurveyLine } from "react-icons/ri";
import LightHeading from "components/core/LightHeading";
import { FaChevronRight } from "react-icons/fa";

export const PageHeader = ({
  addSurveyAction,
  addStudyAction,
  addFolderAction,
  foldersName,
}) => {
  const renderAddStudyTooltip = (children) => (
    <Tooltip
      hasArrow
      label={
        <Flex textAlign="center">
          A Study is a container, which randomises participants into multiple
          child Surveys
        </Flex>
      }
    >
      {children}
    </Tooltip>
  );

  const renderButtons = () => (
    <Stack direction="row">
      {renderAddStudyTooltip(
        <Button
          colorScheme="green"
          variant="outline"
          leftIcon={<FaPlusCircle />}
          onClick={addStudyAction}
        >
          Add a Study
        </Button>
      )}
      <Button
        colorScheme="green"
        leftIcon={<FaPlusCircle />}
        onClick={addSurveyAction}
      >
        Add a Survey
      </Button>
    </Stack>
  );

  const renderMenu = () => (
    <Menu>
      <MenuButton as={Button} colorScheme="green" rightIcon={<FaChevronDown />}>
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
        {renderAddStudyTooltip(
          <MenuItem icon={<AiOutlineGroup />} onClick={addStudyAction}>
            Add a Study
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );

  return (
    <Flex my={8} align="center" justify="space-between">
      {foldersName ? (
        <Breadcrumb
          spacing="8px"
          separator={<FaChevronRight color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/surveys">
              <LightHeading as="h1" size="md">
                Home
              </LightHeading>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              <LightHeading as="h1" size="md">
                Folder: {foldersName}
              </LightHeading>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      ) : (
        <LightHeading as="h1" size="xl">
          {foldersName ? `Folder: ${foldersName}  ` : "My Surveys"}
        </LightHeading>
      )}
      {foldersName ? (
        renderButtons()
      ) : (
        <VStack align="end">{renderMenu()}</VStack>
      )}
    </Flex>
  );
};
