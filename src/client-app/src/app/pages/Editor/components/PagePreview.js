import React, { createElement } from "react";
import { EmptyState } from "components/core";
import { getComponent } from "services/page-items";
import { usePageListContext } from "../contexts/PageList";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { FaFileAlt } from "react-icons/fa";
import { Stack } from "@chakra-ui/core";
import PageItemRender from "components/shared/PageItemRender";
import { usePageItemActions } from "../contexts/PageItemActions";

const NoPages = ({ addPage }) => (
  <EmptyState
    message="Get your Survey started with a new Page"
    splash={FaFileAlt}
    callToAction={{
      label: "Add a Page",
      onClick: addPage
    }}
  />
);

// TODO: Document this capability for components
// with the api (props signature, how renderedItem works...)
const PageItemPreviewEditor = ({ item, renderComponent, params }) => {
  const { setParamValue } = usePageItemActions();

  // item specific param value setter, so the custom editor can easily set params
  const handleParamChange = (paramKey, paramValue) =>
    setParamValue(item.id, paramKey, paramValue);

  return createElement(renderComponent.editorComponent, {
    // rendered as the platform normally would
    renderedItem: (
      <PageItemRender
        itemId={item.id}
        component={renderComponent}
        params={params}
      />
    ),
    params,
    onParamChange: handleParamChange
  });
};

const PagePreview = () => {
  const { pages } = useFetchSurvey();
  const { selectedPageItem, addPage } = usePageListContext();

  // Handle no selected item
  if (!selectedPageItem?.pageId) {
    if (!pages?.length) return <NoPages addPage={addPage} />;
    return <EmptyState message="Select a Page Item to edit" />;
  }

  const page = pages.find(({ id }) => id === selectedPageItem.pageId);

  return (
    <Stack width="100%">
      {page.components.map(item => {
        const isSelected = item.id === selectedPageItem.itemId;
        const renderComponent = getComponent(item.type);

        // If there's a custom editor for the current selected item, use it
        if (isSelected && renderComponent.editorComponent)
          return (
            <PageItemPreviewEditor
              key={item.id}
              item={item}
              renderComponent={renderComponent}
              params={item.params}
            />
          );

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
  );
};

export default PagePreview;
