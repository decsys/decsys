import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Flex, Box, PseudoBox, useColorMode, Text } from "@chakra-ui/core";
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
import { usePageListContext } from "../../contexts/PageList";
import { some } from "services/flags";
import PlaceholderDot from "components/core/PlaceholderDot";
import { BsDot } from "react-icons/bs";

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

const ItemInfo = ({ type, id, dragHandleProps, isBusy }) => (
  <Flex ml={8} align="center" {...dragHandleProps} width="100%">
    <Flex width="1.5em" justify="center">
      {<Box as={isBusy ? BsDot : FaGripVertical} color="gray.500" />}
    </Flex>
    <ItemIcon type={type} />
    <Text isTruncated>{id}</Text>
  </Flex>
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

const ItemActionPlaceholders = () => {
  const p = { p: "9px", dotSize: "14px" };
  return (
    <>
      <PlaceholderDot {...p} />
      <PlaceholderDot {...p} variantColor="red" />
    </>
  );
};

export const PageItem = ({
  item,
  innerRef,
  draggableProps = {},
  dragHandleProps = {},
  isDragging
}) => {
  const actions = usePageItemActions();
  const { busy } = usePageListContext();
  const isBusy = item.isLoading || some(busy);

  const { colorMode } = useColorMode();
  const selectStyle = {
    light: { bg: "blue.200" },
    dark: { bg: "blue.700" }
  };
  return (
    <PseudoBox
      as={Flex}
      ref={innerRef}
      bg={isDragging ? selectStyle[colorMode].bg : "inherit"}
      _hover={isBusy ? {} : { ...selectStyle[colorMode] }}
      transition="background-color .1s ease"
      {...draggableProps}
      role="group"
    >
      <ItemInfo
        isBusy={busy.isPageDragging}
        {...item}
        dragHandleProps={dragHandleProps}
      />

      {some(busy) ? (
        <ItemActionPlaceholders />
      ) : (
        <ItemActions {...item} {...actions} />
      )}
    </PseudoBox>
  );
};

const DraggablePageItem = ({ item, order }) => {
  return (
    <Draggable draggableId={item.id} index={order}>
      {(provided, snapshot) => (
        <PageItem item={item} {...provided} {...snapshot} />
      )}
    </Draggable>
  );
};

export default DraggablePageItem;
