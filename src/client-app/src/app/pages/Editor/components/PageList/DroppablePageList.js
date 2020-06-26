import React, { memo } from "react";
import { Droppable } from "react-beautiful-dnd";
import DraggablePage, { Page } from "./DraggablePage";
import { Box } from "@chakra-ui/core";
import pageItemActions from "../../actions/pageItemActions";
import { PageItemActionsProvider } from "../../contexts/PageItemActions";
import { usePageListContext } from "../../contexts/PageList";
import { useFetchSurvey } from "app/contexts/FetchSurvey";

const Row = memo(
  ({ data, index: i, style }) => {
    const { page, getPageItemActions } = data;
    const actions = getPageItemActions(page.id);
    return (
      <div key={page.id} style={style}>
        <PageItemActionsProvider value={actions}>
          <DraggablePage page={page} order={i + 1} />
        </PageItemActionsProvider>
      </div>
    );
  },
  ({ data, index: i }, { data: dNext, index: iNext }) => {
    if (i !== iNext || data.getPageItemActions !== dNext.getPageItemActions)
      return false;
    return data.page === dNext.page;
  }
);

const DroppablePageList = () => {
  const { pages, id: surveyId } = useFetchSurvey();
  const {
    mutate,
    selectedPageItem,
    setSelectedPageItem
  } = usePageListContext();
  const getPageItemActions = pageId =>
    pageItemActions(
      surveyId,
      pageId,
      mutate,
      selectedPageItem,
      setSelectedPageItem
    );

  return (
    <Droppable
      droppableId="page-list"
      type="PAGE"
      renderClone={(provided, snapshot, { source: { index } }) => (
        <Page
          page={pages[index]}
          order={index + 1}
          {...provided}
          {...snapshot}
        />
      )}
    >
      {({ innerRef, droppableProps, placeholder }) => (
        <Box
          px={4}
          ref={innerRef}
          {...droppableProps}
          height="100%"
          style={{ overflowY: "scroll" }}
        >
          {pages.map((page, i) => (
            <Row key={page.id} data={{ page, getPageItemActions }} index={i} />
          ))}
          {placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default DroppablePageList;
