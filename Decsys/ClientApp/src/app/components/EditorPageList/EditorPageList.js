import React from "react";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import { Typography, Box, Button } from "@smooth-ui/core-sc";
import Page from "./Page";
import { Plus } from "styled-icons/fa-solid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const EditorPageList = ({ actions, components, pages }) => {
  const onDragEnd = result => {
    if (!result.destination) return;
    if (result.source.droppableId !== result.destination.droppableId) return;
    if (result.destination.index === result.source.index) return;
    // TODO different ops for different lists
    if (result.destination.droppableId === "pageList")
      actions.onPageDragEnd(result.draggableId, result.destination.index);
    else
      actions.onComponentDragEnd(
        result.destination.droppableId,
        result.draggableId,
        result.destination.index
      );
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="pageList">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <FlexBox flexDirection="column" px={2}>
              <FlexBox justifyContent="space-between" alignItems="center">
                <Typography textAlign="center" p={1}>
                  Survey Pages
                </Typography>
                <Button
                  size="sm"
                  variant="success"
                  onClick={actions.onAddClick}
                >
                  <Plus size="1em" /> Add Page
                </Button>
              </FlexBox>
              {pages
                .sort(({ order: a }, { order: b }) => a - b)
                .map((x, i) => {
                  return (
                    <Draggable key={i} draggableId={x.id} index={x.order - 1}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Box mb={1}>
                            <Page
                              pageListProvided={provided}
                              n={x.order}
                              page={x}
                              componentList={components}
                              {...actions}
                            />
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
            </FlexBox>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

EditorPageList.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape(Page.propTypes.page)),
  components: Page.propTypes.componentList,
  actions: PropTypes.shape({
    onAddClick: PropTypes.func.isRequired,
    onComponentSelect: PropTypes.func.isRequired,
    pageActions: Page.propTypes.pageActions,
    itemActions: Page.propTypes.itemActions
  })
};

export default EditorPageList;
