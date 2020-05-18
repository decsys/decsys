import React from "react";
import { Flex, useColorMode } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import { Draggable } from "react-beautiful-dnd";

const DraggablePage = ({ page }) => {
  const { colorMode } = useColorMode();
  const style = { light: { bg: "gray.200" }, dark: { bg: "gray.700" } };
  return (
    <Draggable draggableId={page.id} index={page.order} type="PAGE">
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <Flex
          p={4}
          mb={2}
          borderRadius={5}
          {...style[colorMode]}
          align="center"
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
        >
          <LightHeading size="sm">
            Page {page.order}: {page.id}
          </LightHeading>
        </Flex>
      )}
    </Draggable>
  );
};

export default DraggablePage;
