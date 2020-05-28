import React from "react";
import { Flex, useColorMode } from "@chakra-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PageHeader from "./PageHeader";
import DraggablePageItem from "./DraggablePageItem";

const DraggablePage = ({ page, order, isBusy }) => {
  const { colorMode } = useColorMode();
  const cardStyle = { light: { bg: "gray.200" }, dark: { bg: "gray.700" } };

  const uid = `${order}_${page.id}`;

  return (
    <Draggable draggableId={uid} index={order}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <Flex
          direction="column"
          mb={2}
          borderRadius={5}
          {...cardStyle[colorMode]}
          ref={innerRef}
          boxShadow={isDragging ? "outline" : "none"}
          role="group"
          {...draggableProps}
        >
          <PageHeader
            page={page}
            order={order}
            dragHandleProps={dragHandleProps}
          />

          <Droppable type={`${uid}:PAGE_ITEM`} droppableId={uid}>
            {({ innerRef, droppableProps, placeholder }) => (
              <Flex ref={innerRef} direction="column" {...droppableProps}>
                {page.componentOrder &&
                  page.componentOrder.map((id, i) => (
                    <DraggablePageItem
                      key={i}
                      item={page.components[id]}
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
        </Flex>
      )}
    </Draggable>
  );
};

export default DraggablePage;
