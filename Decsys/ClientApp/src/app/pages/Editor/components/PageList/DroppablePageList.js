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
          mt={2}
          p={2}
          pb={0}
          ref={innerRef}
          {...droppableProps}
          style={{ overflow: "auto" }}
        >
          {pages.map(page => (
            <DraggablePage key={page.id} page={page} />
          ))}
          {placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default DroppablePageList;
