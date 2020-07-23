import { createElement } from "react";

const PageItemRender = ({ _context, component, params }) => {
  if (!component) return null;

  // TODO: document the props signature change here.
  // Components now receive ({_context, ...params, ...results}) props
  // _context is prepared in the call site; this allows Previews to behave differently to Surveys

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
    _context,
  });
};

export default PageItemRender;
