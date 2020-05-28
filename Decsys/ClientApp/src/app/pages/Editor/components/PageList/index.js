import React, { useState } from "react";
import { Flex } from "@chakra-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListActions } from "../../contexts/PageListActions";

const PageList = () => {
  const [isListBusy, setIsListBusy] = useState(false);
  const [busyPage, setBusyPage] = useState();
  const { movePage } = usePageListActions();

  const handleDragStart = ({ source, type }) => {
    if (type === "PAGE") setIsListBusy(true);
    console.log(type.split("_"));
    if (type.split(":")[1] === "PAGE_ITEM")
      setBusyPage(source.droppableId.split("_")[1]);
  };

  const handleDragEnd = ({ draggableId, source, destination }) => {
    setIsListBusy(false);
    setBusyPage(null);
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return;
    if (destination.index === source.index) return;
    if (destination.droppableId === "page-list")
      movePage(draggableId.split("_")[1], source.index, destination.index);
  };

  return (
    <Flex direction="column" width="100%">
      <Header />

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DroppablePageList isBusy={isListBusy} busyPage={busyPage} />
      </DragDropContext>
    </Flex>
  );
};

export default PageList;
