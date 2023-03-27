import { Draggable } from "react-beautiful-dnd";
import {
  Flex,
  Icon,
  useColorMode,
  Text,
  Grid,
  Select,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaHeading,
  FaParagraph,
  FaImage,
  FaArrowsAltV,
  FaQuestion,
  FaGripVertical,
  FaTimes,
  FaCopy,
  FaAsterisk,
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

const QuestionButton = ({ isQuestionItem, id, setQuestionItem, type }) => {
  const { busy } = usePageListContext();
  const handleQuestionClick = () => setQuestionItem(id);
  if (!isBuiltIn(type)) {
    return <Flex pl={8} align="center"></Flex>;
  }
  if (isQuestionItem) {
    return (
      <Tooltip label={"Current Question Item"}>
        <Center width={8} height={"100%"}>
          <Icon as={FaQuestion} />
        </Center>
      </Tooltip>
    );
  }

  if (some(busy)) {
    const p = { p: "9px", dotSize: "14px" };
    return (
      <Center width={8}>
        <PlaceholderDot {...p} />
      </Center>
    );
  }

  return (
    <Tooltip label={"Set to Question Item"}>
      <Center
        width={8}
        height={"100%"}
        cursor={"pointer"}
        color="gray"
        _hover={{
          color: "green",
        }}
      >
        <Icon as={FaQuestion} onClick={handleQuestionClick} />
      </Center>
    </Tooltip>
  );
};

export const ItemInfo = ({
  type,
  params: { text },
  dragHandleProps,
  isBusy,
  onSelect,
  isQuestionItem,
  setQuestionItem,
  id,
}) => (
  <Flex align="center" width="100%" {...dragHandleProps} onClick={onSelect}>
    <Flex width="20%" p="3px">
      <Icon as={FaAsterisk} />
      <QuestionButton
        isQuestionItem={isQuestionItem}
        setQuestionItem={setQuestionItem}
        id={id}
        type={type}
      />
    </Flex>
    <Icon as={!type || isBusy ? BsDot : FaGripVertical} color="gray.500" />
    <ItemIcon type={type} />
    <Text as={!text ? "em" : "p"} isTruncated>
      {isBuiltIn(type) ? text || capitalise(type) : "Response"}
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
      templateColumns="minmax(50px, 1fr) auto auto"
    >
      <ItemInfo
        isBusy={busy.isPageDragging}
        {...(item || { params: {} })}
        dragHandleProps={dragHandleProps}
        {...actions}
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
