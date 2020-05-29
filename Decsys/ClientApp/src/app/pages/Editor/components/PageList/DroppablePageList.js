import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSurvey } from "app/contexts/Survey";
import DraggablePage from "./DraggablePage";
import { Box } from "@chakra-ui/core";
import pageItemActions from "../../actions/pageItemActions";
import { PageItemActionsProvider } from "../../contexts/PageItemActions";
import { usePageListActions } from "../../contexts/PageListActions";

const DroppablePageList = ({ isBusy, isPageBusy }) => {
  const { pages, id: surveyId } = useSurvey();
  const { mutate } = usePageListActions();

  return (
    <Droppable droppableId="page-list" type="PAGE">
      {({ innerRef, droppableProps, placeholder }) => (
        <Box
          px={4}
          ref={innerRef}
          {...droppableProps}
          height="100%"
          style={{ overflowY: "scroll" }}
        >
          {pages.map((page, i) => {
            const pageBusy = isBusy || page.isLoading || isPageBusy;
            const actions = pageItemActions(surveyId, page.id, mutate);
            return (
              <PageItemActionsProvider key={page.id} value={actions}>
                <DraggablePage page={page} isBusy={pageBusy} order={i + 1} />
              </PageItemActionsProvider>
            );
          })}
          {placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default DroppablePageList;
