import React from "react";
import { Flex } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListContext } from "../../contexts/PageList";

const PageList = () => {
  const { movePage, movePageItem, setBusy } = usePageListContext();

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
    else {
      // droppableId is a page ID for page item droppables
      // we can't really validate that, but it's the only other
      // kind of droppable in this DragDropContext
      movePageItem(
        destination.droppableId,
        draggableId,
        source.index,
        destination.index
      );
    }
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
