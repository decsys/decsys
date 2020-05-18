import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSurvey } from "app/contexts/Survey";
import DraggablePage from "./DraggablePage";
import { Box } from "@chakra-ui/core";

const DroppablePageList = () => {
  const { pages } = useSurvey();
  return (
    <Droppable droppableId="page-list" type="PAGE">
      {({ innerRef, droppableProps, placeholder }) => (
        <Box
          px={4}
          ref={innerRef}
          {...droppableProps}
          style={{ overflow: "auto" }}
        >
          {pages.map((page, i) => (
            <DraggablePage key={i} page={page} />
          ))}
          {placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default DroppablePageList;
