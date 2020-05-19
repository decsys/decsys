import React from "react";
import { Flex } from "@chakra-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListActions } from "../../contexts/PageListActions";

const PageList = () => {
  const { movePage } = usePageListActions();

  const handleDragEnd = result => {
    if (!result.destination) return;
    if (result.source.droppableId !== result.destination.droppableId) return;
    if (result.destination.index === result.source.index) return;
    if (result.destination.droppableId === "page-list")
      movePage(result.draggableId.split("_")[1], result.destination.index);
  };

  return (
    <Flex direction="column" width="100%">
      <Header />

      <DragDropContext onDragEnd={handleDragEnd}>
        <DroppablePageList />
      </DragDropContext>
    </Flex>
  );
};

export default PageList;
