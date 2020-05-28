import React, { useState } from "react";
import { Flex } from "@chakra-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./Header";
import DroppablePageList from "./DroppablePageList";
import { usePageListActions } from "../../contexts/PageListActions";

const PageList = () => {
  const [busy, setBusy] = useState({});
  const { movePage } = usePageListActions();

  const handleDragStart = ({ type }) => {
    if (type === "PAGE") setBusy({ list: true });
    if (type.split(":")[0] === "PAGE_ITEM") setBusy({ page: true });
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

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DroppablePageList isBusy={busy.list} isPageBusy={busy.page} />
      </DragDropContext>
    </Flex>
  );
};

export default PageList;
