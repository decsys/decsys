import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Flex, Box, PseudoBox, useColorMode } from "@chakra-ui/core";
import {
  FaHeading,
  FaParagraph,
  FaImage,
  FaArrowsAltV,
  FaQuestion,
  FaGripVertical,
  FaTimes,
  FaCopy
} from "react-icons/fa";
import { DotHoverIconButton } from "components/core";
import { usePageItemActions } from "../../contexts/PageItemActions";

const builtInIcons = {
  heading: FaHeading,
  paragraph: FaParagraph,
  image: FaImage,
  spacer: FaArrowsAltV
};

const ItemIcon = ({ type }) => {
  const Icon = builtInIcons[type] || FaQuestion;
  //TODO: response item icons

  return (
    <Flex px={1} align="center">
      <Box as={Icon} />
    </Flex>
  );
};

const ItemInfo = ({ type, id, dragHandleProps }) => (
  <Flex ml={8} align="center" {...dragHandleProps} width="100%">
    <Flex width="1.5em" justify="center">
      <Box as={FaGripVertical} color="gray.500" />
    </Flex>
    <ItemIcon type={type} />
    {id}
  </Flex>
);

const PlaceholderButtons = () => (
  <>
    <DotHoverIconButton size="sm" />
    <DotHoverIconButton size="sm" variantColor="red" />
  </>
);

const ItemActions = ({ id, duplicatePageItem, deletePageItem }) => {
  const handleDeleteClick = () => deletePageItem(id);
  const handleDuplicateClick = () => duplicatePageItem(id);
  return (
    <>
      <DotHoverIconButton
        size="sm"
        icon={FaCopy}
        onClick={handleDuplicateClick}
      />
      <DotHoverIconButton
        size="sm"
        variantColor="red"
        icon={FaTimes}
        onClick={handleDeleteClick}
      />
    </>
  );
};

const DraggablePageItem = ({ item, order, isBusy }) => {
  const actions = usePageItemActions();
  const { colorMode } = useColorMode();
  const selectStyle = {
    light: { bg: "blue.200" },
    dark: { bg: "blue.700" }
  };
  return (
    <Draggable draggableId={item.id} index={order}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <PseudoBox
          as={Flex}
          ref={innerRef}
          bg={isDragging ? selectStyle[colorMode].bg : "inherit"}
          _hover={isBusy ? {} : { ...selectStyle[colorMode] }}
          transition="background-color .1s ease"
          {...draggableProps}
          role="group"
        >
          <ItemInfo {...item} dragHandleProps={dragHandleProps} />

          {isBusy ? (
            <PlaceholderButtons />
          ) : (
            <ItemActions {...item} {...actions} />
          )}
        </PseudoBox>
      )}
    </Draggable>
  );
};

export default DraggablePageItem;
