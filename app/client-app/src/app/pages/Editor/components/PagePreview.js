import React, { createElement } from "react";
import { getComponent } from "services/page-items";
import { usePageListContext } from "../contexts/PageList";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { Stack } from "@chakra-ui/core";
import PageItemRender from "components/shared/PageItemRender";
import {
  usePageItemActions,
  PageItemActionsProvider,
} from "../contexts/PageItemActions";
import pageItemActions from "../actions/pageItemActions";
import { renderContextDefaults as renderActions } from "@decsys/param-types/ResponseItemContexts";

// TODO: Document this capability for components
// with the api (props signature, how renderedItem works..., _context...)
const PageItemCustomPreviewEditor = ({
  surveyId,
  pageId,
  itemId,
  renderComponent,
  params,
}) => {
  const { setParamValue } = usePageItemActions();

  // item specific param value setter, so the custom editor can easily set params
  const handleParamChange = (paramKey, paramValue) =>
    setParamValue(itemId, paramKey, paramValue);

  const previewEditorContext = {
    itemId,
    pageId,
    surveyId,
    handleParamChange,
  };

  const renderContext = {
    itemId,
    pageId,
    surveyId,
    ...renderActions,
  };

  return createElement(renderComponent.previewEditorComponent, {
    // rendered as the platform normally would
    renderedItem: (
      <PageItemRender
        _context={renderContext}
        component={renderComponent}
        params={params}
      />
    ),
    params,
    _context: previewEditorContext,
  });
};

const PagePreview = () => {
  const { pages, id, mutate } = useFetchSurvey();
  const { selectedPageItem, setSelectedPageItem } = usePageListContext();

  const page = pages.find(({ id }) => id === selectedPageItem.pageId);

  return (
    <Stack width="100%" p={4}>
      {page.components.map((item) => {
        const isSelected = item.id === selectedPageItem.itemId;
        const renderComponent = getComponent(item.type);

        // prepare contexts for previewing

        // If there's a custom editor for the current selected item, use it
        if (isSelected && renderComponent.previewEditorComponent) {
          const actions = pageItemActions(
            id,
            page.id,
            mutate,
            selectedPageItem,
            setSelectedPageItem
          );

          return (
            <PageItemActionsProvider key={item.id} value={actions}>
              <PageItemCustomPreviewEditor
                surveyId={id}
                pageId={selectedPageItem.pageId}
                itemId={item.id}
                renderComponent={renderComponent}
                params={item.params}
              />
            </PageItemActionsProvider>
          );
        }

        // else just render it and it will use the params editor window
        const renderContext = {
          itemId: item.id,
          pageId: selectedPageItem.pageId,
          surveyId: id,
          ...renderActions,
        };

        return (
          <PageItemRender
            key={item.id}
            _context={renderContext}
            component={renderComponent}
            params={item.params}
          />
        );
      })}
    </Stack>
  );
};

export default PagePreview;
