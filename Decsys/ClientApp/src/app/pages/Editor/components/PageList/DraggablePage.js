import React, { useState } from "react";
import { Flex, useColorMode } from "@chakra-ui/core";
import { Draggable } from "react-beautiful-dnd";
import PageHeader from "./PageHeader";

const DraggablePage = ({ page }) => {
  const { colorMode } = useColorMode();
  const cardStyle = { light: { bg: "gray.200" }, dark: { bg: "gray.700" } };
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  return (
    <Draggable
      draggableId={`page_${page.order}_${page.id}`}
      index={page.order}
      type="PAGE"
    >
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <Flex
          direction="column"
          mb={2}
          borderRadius={5}
          {...cardStyle[colorMode]}
          ref={innerRef}
          {...draggableProps}
          boxShadow={isDragging ? "0 5px 10px rgba(0,0,0,0.6)" : "none"}
          transition="box-shadow 0.2s ease"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <PageHeader
            page={page}
            isPageHovered={isHovered}
            dragHandleProps={dragHandleProps}
          />

          {/* Display items */}

          <Flex p={2}>Response item</Flex>
        </Flex>
      )}
    </Draggable>
  );
};

export default DraggablePage;
