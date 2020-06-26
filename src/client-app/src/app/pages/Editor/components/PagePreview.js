import React, { createElement } from "react";
import { FlexBox, EmptyState } from "components/core";
import { getComponent } from "services/page-items";
import { COMPONENT_RESULTS } from "constants/event-types";
import ParagraphPreview from "components/SurveyPage/ParagraphPreview";
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

const PagePreview = () => {
  const { pages } = useFetchSurvey();
  const { selectedPageItem, addPage } = usePageListContext();
  const { setParamValue } = usePageItemActions();

  // Handle no selected item
  if (!selectedPageItem?.pageId) {
    if (!pages?.length) return <NoPages addPage={addPage} />;
    return <EmptyState message="Select a Page Item to edit" />;
  }

  const page = pages.find(({ id }) => id === selectedPageItem.pageId);

  return (
    <Stack width="100%">
      {page.components.map(item => {
        const renderComponent = getComponent(item.type);

        let params = {
          ...item.params,
          text: "hello" // testing
        };

        // If there's a custom editor for the current selected item, use it

        if (
          item.id === selectedPageItem.itemId &&
          renderComponent.editorComponent
        ) {
          // item specific param value setter, so the custom editor can easily set params
          const handleParamChange = (paramKey, paramValue) =>
            setParamValue(item.id, paramKey, paramValue);

          return createElement(renderComponent.editorComponent, {
            key: item.id,
            component: renderComponent,
            params,
            onParamChange: handleParamChange
          });
        }

        // else just render it and it will use the params editor window
        return (
          <PageItemRender
            key={item.id}
            component={renderComponent}
            params={params}
          />
        );
      })}
    </Stack>
  );
};

const SurveyPageBody = ({
  id,
  components,
  setNextEnabled,
  logEvent,
  editorComponentId,
  pageId,
  onParamChange
}) => {
  // if there's an editor component, we are in the editor
  // and shouldn't set functional actions
  const actions = componentId =>
    !editorComponentId
      ? {
          setNextEnabled,
          logEvent: (type, payload) => logEvent(componentId, type, payload),
          logResults: payload =>
            logEvent(componentId, COMPONENT_RESULTS, payload)
        }
      : undefined;

  const handleParagraphParamChange = e =>
    onParamChange(pageId, editorComponentId, "text", e.target.value);

  return (
    <FlexBox p={1} flexDirection="column">
      {components.map(x => {
        // here we can allow special editors for certain types
        // such as Paragraph
        if (x.id === editorComponentId) {
          if (x.type === "paragraph") {
            return (
              <ParagraphPreview
                key={x.id}
                component={getComponent(x.type)}
                params={x.params}
                onChange={handleParagraphParamChange}
              />
            );
          }
        }
        // if not the selected component for editing,
        // or if not matching a special type above
        // just render the component regularly
        return (
          <PageItemRender
            key={x.id}
            component={getComponent(x.type)}
            actions={actions(x.id)}
            params={
              x.type === "image"
                ? {
                    ...x.params,
                    surveyId: id,
                    id: x.id
                  }
                : x.params
            }
          />
        );
      })}
    </FlexBox>
  );
};

export default PagePreview;
