import React, { useState } from "react";
import { Flex } from "@chakra-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListActions } from "../../contexts/PageListActions";

const PageList = () => {
  const [listBusy, setListBusy] = useState(false);
  const { movePage } = usePageListActions();

  const handleDragStart = ({ type }) => {
    if (!type === "PAGE") return;
    setListBusy(true);
  };

  const handleDragEnd = ({ draggableId, source, destination }) => {
    setListBusy(false);
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
        <DroppablePageList busy={listBusy} />
      </DragDropContext>
    </Flex>
  );
};

export default PageList;
