import React from "react";
import { Flex, useColorMode } from "@chakra-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PageHeader from "./PageHeader";

const DraggablePage = ({ page, order }) => {
  const { colorMode } = useColorMode();
  const cardStyle = { light: { bg: "gray.200" }, dark: { bg: "gray.700" } };

  const uid = `${order}_${page.id}`;

  return (
    <Draggable draggableId={uid} index={order} type="PAGE">
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <Flex
          direction="column"
          mb={2}
          borderRadius={5}
          {...cardStyle[colorMode]}
          ref={innerRef}
          {...draggableProps}
          boxShadow={isDragging ? "outline" : "none"}
          role="group"
        >
          <PageHeader
            page={page}
            order={order}
            dragHandleProps={dragHandleProps}
          />

          <Droppable type={`${uid}_ITEM`} droppableId={uid}>
            {({ droppableProps, innerRef }) => (
              <Flex
                ref={innerRef}
                direction="column"
                {...droppableProps}
                ml={8}
              >
                {page.components &&
                  page.components.map(c => <Flex p={1}>{c.id}</Flex>)}
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
