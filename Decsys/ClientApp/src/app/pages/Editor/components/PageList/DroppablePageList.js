import React, { memo, forwardRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSurvey } from "app/contexts/Survey";
import DraggablePage, { Page } from "./DraggablePage";
import { Box } from "@chakra-ui/core";
import pageItemActions from "../../actions/pageItemActions";
import { PageItemActionsProvider } from "../../contexts/PageItemActions";
import { usePageListContext } from "../../contexts/PageList";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList, areEqual } from "react-window";

const basePageHeight = 80;
const pageItemHeight = 32;

/** calculate the height of a page based on the known height per page item, and the rest of the page */
const getPageHeight = counts => i =>
  basePageHeight + pageItemHeight * counts[i];

/** split the heights of all pages evenly, so the whole list is the correct height */
const getPageHeightEstimate = (pageCount, pageItemCounts) => {
  const totalItems = pageItemCounts.reduce((a, c) => a + c);
  return basePageHeight + (pageItemHeight * totalItems) / pageCount;
};

const Row = memo(({ data, index: i, style }, ref) => {
  const { pages, surveyId, mutate } = data;
  const page = pages[i];
  const actions = pageItemActions(surveyId, page.id, mutate);
  return (
    <div key={page.id} style={style}>
      <PageItemActionsProvider value={actions}>
        <DraggablePage page={page} order={i + 1} />
      </PageItemActionsProvider>
    </div>
  );
}, areEqual);

const DroppablePageList = () => {
  const { pages, id: surveyId } = useSurvey();
  const { mutate } = usePageListContext();

  const pageItemCounts = pages.map(p => p.components.length);

  return (
    <Box height="100%">
      <AutoSizer>
        {({ width, height }) => (
          <Droppable
            droppableId="page-list"
            type="PAGE"
            mode="virtual"
            renderClone={(provided, snapshot, { source: { index } }) => (
              <Page
                page={pages[index]}
                order={index + 1}
                {...provided}
                {...snapshot}
              />
            )}
          >
            {({ innerRef }) => (
              <VariableSizeList
                height={height}
                width={width}
                itemCount={pages.length}
                estimatedItemSize={getPageHeightEstimate(
                  pages.length,
                  pageItemCounts
                )}
                itemSize={getPageHeight(pageItemCounts)}
                itemData={{ pages, surveyId, mutate }}
                outerRef={innerRef}
              >
                {Row}
              </VariableSizeList>

              // <Box
              //   px={4}
              //   ref={innerRef}
              //   {...droppableProps}
              //   height="100%"
              //   style={{ overflowY: "scroll" }}
              // >
              //   {pages.map((page, i) => {
              //     const actions = pageItemActions(surveyId, page.id, mutate);
              //     return (
              //       <PageItemActionsProvider key={page.id} value={actions}>
              //         <DraggablePage page={page} order={i + 1} />
              //       </PageItemActionsProvider>
              //     );
              //   })}
              //   {placeholder}
              // </Box>
            )}
          </Droppable>
        )}
      </AutoSizer>
    </Box>
  );
};

export default DroppablePageList;
