import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Tooltip,
} from "@chakra-ui/core";
import {
  FaPlus,
  FaHeading,
  FaParagraph,
  FaImage,
  FaArrowsAltV,
} from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { usePageListContext } from "../../contexts/PageList";

const AddContentItemMenu = ({ id }) => {
  const { addItemToPage } = usePageListContext();

  const handleItemClick = (type) => {
    addItemToPage(id, type);
  };

  return (
    <Menu>
      <Tooltip
        zIndex={999999}
        placement="top"
        hasArrow
        label="Add Page Content items to this page"
      >
        <MenuButton
          as={Button}
          p={0}
          variant="ghost"
          colorScheme="green"
          _focus={{}}
        >
          <Icon
            display="none"
            _groupHover={{ display: "inherit" }}
            as={FaPlus}
          />
          <Icon _groupHover={{ display: "none" }} as={BsDot} />
        </MenuButton>
      </Tooltip>

      <MenuList>
        <MenuItem onClick={() => handleItemClick("heading")}>
          <Icon as={FaHeading} mr={2} />
          Heading
        </MenuItem>
        <MenuItem onClick={() => handleItemClick("paragraph")}>
          <Icon as={FaParagraph} mr={2} />
          Paragraph
        </MenuItem>
        <MenuItem onClick={() => handleItemClick("image")}>
          <Icon as={FaImage} mr={2} />
          Image
        </MenuItem>
        <MenuItem onClick={() => handleItemClick("spacer")}>
          <Icon as={FaArrowsAltV} mr={2} />
          Vertical Spacer
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AddContentItemMenu;
