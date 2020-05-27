import React from "react";
import { Flex } from "@chakra-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListActions } from "../../contexts/PageListActions";

const PageList = () => {
  const { movePage } = usePageListActions();

  const handleDragEnd = ({ draggableId, source, destination }) => {
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return;
    if (destination.index === source.index) return;
    if (destination.droppableId === "page-list")
      movePage(draggableId.split("_")[1], source.index, destination.index);
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
