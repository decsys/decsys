import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  PseudoBox,
  Box,
  Tooltip
} from "@chakra-ui/core";
import {
  FaPlus,
  FaHeading,
  FaParagraph,
  FaImage,
  FaArrowsAltV
} from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { usePageListActions } from "../../contexts/PageListActions";

const AddContentItemMenu = ({ id }) => {
  const { addItemToPage } = usePageListActions();

  const handleItemClick = type => {
    addItemToPage(id, type);
  };

  return (
    <Menu>
      <Tooltip
        placement="top"
        hasArrow
        label="Add Page Content items to this page"
      >
        <MenuButton
          as={Button}
          p={0}
          variant="ghost"
          variantColor="green"
          _focus={{}}
        >
          <PseudoBox
            display="none"
            _groupHover={{ display: "inherit" }}
            as={FaPlus}
          />
          <PseudoBox _groupHover={{ display: "none" }} as={BsDot} />
        </MenuButton>
      </Tooltip>

      <MenuList>
        <MenuItem onClick={() => handleItemClick("heading")}>
          <Box as={FaHeading} mr={2} />
          Heading
        </MenuItem>
        <MenuItem onClick={() => handleItemClick("paragraph")}>
          <Box as={FaParagraph} mr={2} />
          Paragraph
        </MenuItem>
        <MenuItem onClick={() => handleItemClick("image")}>
          <Box as={FaImage} mr={2} />
          Image
        </MenuItem>
        <MenuItem onClick={() => handleItemClick("spacer")}>
          <Box as={FaArrowsAltV} mr={2} />
          Vertical Spacer
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AddContentItemMenu;
