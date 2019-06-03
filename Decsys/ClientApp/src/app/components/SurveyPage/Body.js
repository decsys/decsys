import React from "react";
import { FlexBox } from "../../components/ui";
import ComponentRender from "../../components/ComponentRender";
import { getComponent } from "../../utils/component-utils";
import { COMPONENT_RESULTS } from "../../utils/event-types";

const SurveyPageBody = ({ id, components, setNextEnabled, logEvent }) => (
  <FlexBox p={1} flexDirection="column">
    {components.map(x => (
      <ComponentRender
        key={x.id}
        component={getComponent(x.type)}
        actions={{
          setNextEnabled,
          logEvent: (type, payload) => logEvent(x.id, type, payload),
          logResults: payload => logEvent(x.id, COMPONENT_RESULTS, payload)
        }}
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
    ))}
  </FlexBox>
);

export default SurveyPageBody;
