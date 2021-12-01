import { Draggable } from "react-beautiful-dnd";
import { Flex, Icon, useColorMode, Text, Grid, Select } from "@chakra-ui/react";
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
import {
  isBuiltIn,
  listLoadedResponseItemTypes,
  getComponent,
} from "services/page-items";
import { defaultColorMode } from "themes";

const builtInIcons = {
  heading: FaHeading,
  paragraph: FaParagraph,
  image: FaImage,
  spacer: FaArrowsAltV,
};

const capitalise = (s) => `${s[0].toUpperCase()}${s.substring(1)}`;

const ItemIcon = ({ type }) => {
  const CustomIcon =
    builtInIcons[type] || getComponent(type)?.icon || FaQuestion;

  return (
    <Flex px={1} align="center">
      <Icon as={CustomIcon} />
    </Flex>
  );
};

export const ItemInfo = ({
  type,
  params: { text },
  dragHandleProps,
  isBusy,
  onSelect,
  isQuestionItem,
}) => (
  <Flex
    pl={8}
    align="center"
    width="100%"
    {...dragHandleProps}
    onClick={onSelect}
  >
    <Icon as={!type || isBusy ? BsDot : FaGripVertical} color="gray.500" />
    <ItemIcon type={type} />
    <Text as={!text ? "em" : "p"} isTruncated>
      {isBuiltIn(type) ? text || capitalise(type) : "Response"}
    </Text>
    {isQuestionItem &&<ItemIcon  />}
  </Flex>
);

const ItemActions = ({ id, duplicatePageItem, deletePageItem, setQuestionItem }) => {
  const handleDeleteClick = () => deletePageItem(id);
  const handleDuplicateClick = () => duplicatePageItem(id);
  const handleQuestionClick = () => setQuestionItem(id);
  return (
    <>
      <DotHoverIconButton
        size="sm"
        icon={FaQuestion}
        tooltip="Set to Question Item"
        onClick={handleQuestionClick}
      />
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
      <PlaceholderDot {...p} />
      <PlaceholderDot {...p} colorScheme="red" />
    </>
  );
};

const ResponseItemSelector = ({ item, isBusy, changePageResponseItem }) => {
  const handleChange = (e) => {
    const v = e.target.value === "None" ? "" : e.target.value;
    changePageResponseItem(item && item.id, v, item && item.order);
  };

  return (
    <Select
      size="sm"
      minW="220px"
      gridColumn="span 2"
      isDisabled={isBusy}
      value={item && item.type}
      onChange={handleChange}
    >
      <>
        <option>None</option>
        {listLoadedResponseItemTypes().map((type) => (
          <option key={type}>{type}</option>
        ))}
      </>
    </Select>
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
  const isBusy = (item && item.isLoading) || some(busy);
  const isSelected = item && selectedPageItem.itemId === item.id;
  const { colorMode } = useColorMode();
  const selectStyle = {
    light: { bg: "blue.300" },
    dark: { bg: "blue.700" },
  };
  const hoverStyle = {
    light: { bg: "blue.200" },
    dark: { bg: "blue.700" },
  };

  const handleSelect = () => {
    item && setSelectedPageItem({ pageId, itemId: item.id });
  };

  let ActionArea;
  if (!item || !isBuiltIn(item.type)) {
    ActionArea = (
      <ResponseItemSelector item={item} isBusy={isBusy} {...actions} />
    );
  } else {
    if (some(busy)) ActionArea = <ItemActionPlaceholders />;
    else ActionArea = <ItemActions {...item} {...actions} />;
  }

  return (
    <Grid
      ref={innerRef}
      bg={
        isDragging || isSelected
          ? selectStyle[colorMode || defaultColorMode].bg
          : "inherit"
      }
      _hover={
        !item || isBusy ? {} : { ...hoverStyle[colorMode || defaultColorMode] }
      }
      transition="background-color .1s ease"
      {...draggableProps}
      role="group"
      templateColumns="minmax(50px, 1fr) auto auto auto"
    >
      <ItemInfo
        isBusy={busy.isPageDragging}
        {...(item || { params: {} })}
        dragHandleProps={dragHandleProps}
        onSelect={handleSelect}
      />

      {ActionArea}
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
