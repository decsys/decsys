import React from "react";
import { Flex, useColorMode } from "@chakra-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PageHeader from "./PageHeader";
import DraggablePageItem from "./DraggablePageItem";
import { LoadingIndicator } from "components/core";

const DraggablePage = ({ page, order, isBusy }) => {
  const { colorMode } = useColorMode();
  const cardStyle = { light: { bg: "gray.200" }, dark: { bg: "gray.700" } };

  return (
    <Draggable draggableId={page.id} index={order}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <Flex
          direction="column"
          mb={2}
          borderRadius={5}
          {...cardStyle[colorMode]}
          ref={innerRef}
          boxShadow={isDragging ? "outline" : "none"}
          transition="box-shadow .2s ease"
          role="group"
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
                    {page.componentOrder &&
                      page.componentOrder.map((id, i) => (
                        <DraggablePageItem
                          key={id}
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
            </>
          )}

          {page.isLoading && (
            <Flex justify="center">
              <LoadingIndicator verb="Adding" noun="page" />
            </Flex>
          )}
        </Flex>
      )}
    </Draggable>
  );
};

export default DraggablePage;
