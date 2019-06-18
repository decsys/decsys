import React from "react";
import { FlexBox } from "../../components/ui";
import ComponentRender from "../../components/ComponentRender";
import { getComponent } from "../../utils/component-utils";
import { COMPONENT_RESULTS } from "../../utils/event-types";
import ParagraphPreview from "./ParagraphPreview";

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
          <ComponentRender
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

export default SurveyPageBody;
