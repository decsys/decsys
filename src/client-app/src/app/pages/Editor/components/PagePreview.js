import React, { createElement } from "react";
import { getComponent } from "services/page-items";
import { usePageListContext } from "../contexts/PageList";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { Stack, LightMode } from "@chakra-ui/core";
import PageItemRender from "components/shared/PageItemRender";
import {
  usePageItemActions,
  PageItemActionsProvider
} from "../contexts/PageItemActions";
import pageItemActions from "../actions/pageItemActions";

// TODO: Document this capability for components
// with the api (props signature, how renderedItem works...)
const PageItemPreviewEditor = ({ itemId, renderComponent, params }) => {
  const { setParamValue } = usePageItemActions();

  // item specific param value setter, so the custom editor can easily set params
  const handleParamChange = (paramKey, paramValue) =>
    setParamValue(itemId, paramKey, paramValue);

  return createElement(renderComponent.editorComponent, {
    // rendered as the platform normally would
    renderedItem: (
      <PageItemRender
        itemId={itemId}
        component={renderComponent}
        params={params}
      />
    ),
    params,
    onParamChange: handleParamChange
  });
};

const PagePreview = () => {
  const { pages, id, mutate } = useFetchSurvey();
  const { selectedPageItem, setSelectedPageItem } = usePageListContext();

  const page = pages.find(({ id }) => id === selectedPageItem.pageId);

  return (
    <LightMode>
      <Stack width="100%">
        {page.components.map(item => {
          const isSelected = item.id === selectedPageItem.itemId;
          const renderComponent = getComponent(item.type);

          // If there's a custom editor for the current selected item, use it
          if (isSelected && renderComponent.editorComponent) {
            const actions = pageItemActions(
              id,
              page.id,
              mutate,
              selectedPageItem,
              setSelectedPageItem
            );

            return (
              <PageItemActionsProvider key={item.id} value={actions}>
                <PageItemPreviewEditor
                  itemId={item.id}
                  renderComponent={renderComponent}
                  params={item.params}
                />
              </PageItemActionsProvider>
            );
          }

          // else just render it and it will use the params editor window
          return (
            <PageItemRender
              key={item.id}
              itemId={item.id}
              component={renderComponent}
              params={item.params}
            />
          );
        })}
      </Stack>
    </LightMode>
  );
};

export default PagePreview;
