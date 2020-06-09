import React from "react";
import { Flex } from "@chakra-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListContext } from "../../contexts/PageList";

const PageList = () => {
  const { movePage, setBusy } = usePageListContext();

  const handleBeforeDragStart = ({ type }) => {
    if (type === "PAGE") setBusy({ isPageDragging: true });
    if (type.split(":")[0] === "PAGE_ITEM")
      setBusy({ isPageItemDragging: true });
  };

  const handleDragEnd = ({ draggableId, source, destination }) => {
    setBusy({});
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return;
    if (destination.index === source.index) return;
    if (destination.droppableId === "page-list")
      movePage(draggableId, source.index, destination.index);
  };

  return (
    <Flex direction="column" width="100%">
      <Header />

      <DragDropContext
        onBeforeDragStart={handleBeforeDragStart}
        onDragEnd={handleDragEnd}
      >
        <DroppablePageList />
      </DragDropContext>
    </Flex>
  );
};

export default PageList;
