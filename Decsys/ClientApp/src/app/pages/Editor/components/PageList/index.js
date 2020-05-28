import React, { useState } from "react";
import { Flex } from "@chakra-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListActions } from "../../contexts/PageListActions";

const PageList = () => {
  const [isListBusy, setIsListBusy] = useState(false);
  const [isPageBusy, setIsPageBusy] = useState(false);
  const { movePage } = usePageListActions();

  const handleDragStart = ({ source, type }) => {
    if (type === "PAGE") setIsListBusy(true);
    if (type.split(":")[1] === "PAGE_ITEM") setIsPageBusy(true);
  };

  const handleDragEnd = ({ draggableId, source, destination }) => {
    setIsListBusy(false);
    setIsPageBusy(false);
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return;
    if (destination.index === source.index) return;
    if (destination.droppableId === "page-list")
      movePage(draggableId, source.index, destination.index);
  };

  return (
    <Flex direction="column" width="100%">
      <Header />

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DroppablePageList isBusy={isListBusy} isPageBusy={isPageBusy} />
      </DragDropContext>
    </Flex>
  );
};

export default PageList;
