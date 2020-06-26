import { createElement } from "react";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { defaultProps as contextDefaults } from "constants/param-types";

// TODO: actions can almost certainly come from a context, but need to support no-ops

const PageItemRender = ({ key: itemId, component, params, actions }) => {
  // Gather platform context data to give to the component
  const { id: surveyId } = useFetchSurvey();

  if (!component) return null;

  // prepare props
  // TODO: document the signature change here.
  // Components now receive ({_context, ...params, ...results}) props

  const _context = { itemId, surveyId, ...actions };

  // merge default Params and set ones
  // TODO: change defaults behaviour.
  // Empty params reverting to defaults is annoying UX and sometimes prevents intentionally empty params
  const paramDefaults = Object.keys(component.params).reduce((agg, x) => {
    agg[x] = component.params[x].defaultValue;
    return agg;
  }, {});

  // TODO: manage passing results here too, when the platform does that again
  const results = {};

  return createElement(component, {
    ...{ ...paramDefaults, ...params },
    ...results,
    _context
  });
};

PageItemRender.defaultProps = {
  actions: contextDefaults
};

export default PageItemRender;
