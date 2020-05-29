import React from "react";
import { Flex, useColorMode } from "@chakra-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PageHeader from "./PageHeader";
import DraggablePageItem from "./DraggablePageItem";
import { LoadingIndicator } from "components/core";

export const Page = ({
  page,
  order,
  isBusy,
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
      borderRadius={5}
      {...cardStyle[colorMode]}
      ref={innerRef}
      boxShadow={isDragging ? "outline" : "none"}
      transition="box-shadow .2s ease"
      {...draggableProps}
    >
      <PageHeader
        page={page}
        isBusy={isBusy}
        order={order}
        dragHandleProps={dragHandleProps}
      />

      {!page.isLoading && (
        <>
          <Droppable type={`PAGE_ITEM:${page.id}`} droppableId={page.id}>
            {({ innerRef, droppableProps, placeholder }) => (
              <Flex ref={innerRef} direction="column" {...droppableProps}>
                {page.components &&
                  page.components.map((item, i) => (
                    <DraggablePageItem
                      key={item.id}
                      item={item}
                      order={i + 1}
                      isBusy={isBusy}
                    />
                  ))}
                {placeholder}
              </Flex>
            )}
          </Droppable>

          <Flex ml={8} p={1}>
            Response item
          </Flex>
        </>
      )}

      {page.isLoading && (
        <Flex justify="center">
          <LoadingIndicator verb="Adding" noun="page" />
        </Flex>
      )}
    </Flex>
  );
};

const DraggablePage = ({ page, order, isBusy }) => (
  <Draggable draggableId={page.id} index={order}>
    {(provided, snapshot) => (
      <Page
        page={page}
        order={order}
        isBusy={isBusy}
        {...provided}
        {...snapshot}
      />
    )}
  </Draggable>
);

export default DraggablePage;
