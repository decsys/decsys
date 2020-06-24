import React from "react";
import { Flex, useColorMode } from "@chakra-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PageHeader from "./PageHeader";
import DraggablePageItem, { PageItem } from "./DraggablePageItem";
import { LoadingIndicator } from "components/core";
import { usePageListContext } from "../../contexts/PageList";

const DroppableItemList = ({ page }) => {
  return (
    <>
      <Droppable
        type={`PAGE_ITEM:${page.id}`}
        droppableId={page.id}
        renderClone={(provided, snapshot, { source: { index } }) => (
          <PageItem
            item={page.components[index - 1]}
            order={index}
            {...provided}
            {...snapshot}
          />
        )}
      >
        {({ innerRef, droppableProps, placeholder }) => (
          <Flex ref={innerRef} direction="column" {...droppableProps}>
            {page.components.map((item, i) => (
              <DraggablePageItem key={item.id} item={item} order={i + 1} />
            ))}
            {placeholder}
          </Flex>
        )}
      </Droppable>

      <Flex ml={8} p={1}>
        Response item
      </Flex>
    </>
  );
};

const PlaceholderItemList = ({ page }) => {
  return (
    <>
      {page.components.map((item, i) => (
        <PageItem key={item.id} item={item} />
      ))}
      <Flex ml={8} p={1}>
        Response item
      </Flex>
    </>
  );
};

const PageContent = ({ page }) => {
  const { busy } = usePageListContext();
  if (page.isLoading)
    return (
      <Flex justify="center">
        <LoadingIndicator verb="Adding" noun="page" />
      </Flex>
    );

  if (busy.isPageDragging) return <PlaceholderItemList page={page} />;

  return <DroppableItemList page={page} />;
};

export const Page = ({
  page,
  order,
  innerRef,
  draggableProps,
  dragHandleProps,
  isDragging
}) => {
  const { colorMode } = useColorMode();
  const cardStyle = { light: { bg: "gray.200" }, dark: { bg: "gray.700" } };

  return (
    <Flex
      direction="column"
      mb={2}
      mx={4}
      borderRadius={5}
      {...cardStyle[colorMode]}
      ref={innerRef}
      boxShadow={isDragging ? "outline" : "none"}
      transition="box-shadow .2s ease"
      {...draggableProps}
    >
      <PageHeader page={page} order={order} dragHandleProps={dragHandleProps} />

      <PageContent page={page} />
    </Flex>
  );
};

const DraggablePage = ({ page, order }) => (
  <Draggable draggableId={page.id} index={order - 1}>
    {(provided, snapshot) => (
      <Page page={page} order={order} {...provided} {...snapshot} />
    )}
  </Draggable>
);

export default DraggablePage;
