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

const AddContentItemMenu = () => {
  return (
    <Menu>
      <Tooltip
        placement="top"
        hasArrow
        label="Add Page Content items to this page"
      >
        <MenuButton as={Button} p={0} variant="ghost" variantColor="green">
          <PseudoBox
            display="none"
            _groupHover={{ display: "inherit" }}
            as={FaPlus}
          />
          <PseudoBox _groupHover={{ display: "none" }} as={BsDot} />
        </MenuButton>
      </Tooltip>

      <MenuList>
        <MenuItem>
          <Box as={FaHeading} mr={2} />
          Heading
        </MenuItem>
        <MenuItem>
          <Box as={FaParagraph} mr={2} />
          Paragraph
        </MenuItem>
        <MenuItem>
          <Box as={FaImage} mr={2} />
          Image
        </MenuItem>
        <MenuItem>
          <Box as={FaArrowsAltV} mr={2} />
          Vertical Spacer
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AddContentItemMenu;
