import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Flex, Icon, useColorMode, Text, Grid } from "@chakra-ui/core";
import {
  FaHeading,
  FaParagraph,
  FaImage,
  FaArrowsAltV,
  FaQuestion,
  FaGripVertical,
  FaTimes,
  FaCopy,
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
  spacer: FaArrowsAltV,
};

const capitalise = (s) => `${s[0].toUpperCase()}${s.substring(1)}`;

const ItemIcon = ({ type }) => {
  const CustomIcon = builtInIcons[type] || FaQuestion;
  //TODO: response item icons

  return (
    <Flex px={1} align="center">
      <Icon as={CustomIcon} />
    </Flex>
  );
};

const ItemInfo = ({
  type,
  params: { text },
  dragHandleProps,
  isBusy,
  onSelect,
}) => (
  <Flex
    pl={8}
    align="center"
    width="100%"
    {...dragHandleProps}
    onClick={onSelect}
  >
    <Icon as={isBusy ? BsDot : FaGripVertical} color="gray.500" />
    <ItemIcon type={type} />
    <Text as={!text ? "em" : "p"} isTruncated>
      {text || capitalise(type)}
    </Text>
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
        colorScheme="red"
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
      <PlaceholderDot {...p} colorScheme="red" />
    </>
  );
};

export const PageItem = ({
  pageId,
  item,
  innerRef,
  draggableProps = {},
  dragHandleProps = {},
  isDragging,
}) => {
  const actions = usePageItemActions();
  const { busy, selectedPageItem, setSelectedPageItem } = usePageListContext();
  const isBusy = item.isLoading || some(busy);
  const isSelected = selectedPageItem.itemId === item.id;

  const { colorMode } = useColorMode();
  const selectStyle = {
    light: { bg: "blue.200" },
    dark: { bg: "blue.700" },
  };

  const handleSelect = () => {
    setSelectedPageItem({ pageId, itemId: item.id });
  };

  return (
    <Grid
      ref={innerRef}
      bg={isDragging || isSelected ? selectStyle[colorMode].bg : "inherit"}
      _hover={isBusy ? {} : { ...selectStyle[colorMode] }}
      transition="background-color .1s ease"
      {...draggableProps}
      role="group"
      templateColumns="minmax(50px, 1fr) auto auto"
    >
      <ItemInfo
        isBusy={busy.isPageDragging}
        {...item}
        dragHandleProps={dragHandleProps}
        onSelect={handleSelect}
      />

      {some(busy) ? (
        <ItemActionPlaceholders />
      ) : (
        <ItemActions {...item} {...actions} />
      )}
    </Grid>
  );
};

const DraggablePageItem = ({ item, order, pageId }) => {
  return (
    <Draggable draggableId={item.id} index={order - 1}>
      {(provided, snapshot) => (
        <PageItem pageId={pageId} item={item} {...provided} {...snapshot} />
      )}
    </Draggable>
  );
};

export default DraggablePageItem;
