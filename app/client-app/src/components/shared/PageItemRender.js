import { createElement } from "react";
import { ensureParamTypes } from "@decsys/param-types";
import { ErrorBoundary } from "components/ErrorBoundary";
import { Alert, AlertIcon } from "@chakra-ui/react";

const PageItemRenderError = ({ __BoundaryError }) => (
  <Alert status="error">
    <AlertIcon />
    {__BoundaryError.message}
  </Alert>
);

const PageItemRenderer = ({ _context, component, params }) => {
  if (!component) return null;

  // TODO: document the props signature change here.
  // Components now receive ({_context, ...params, ...results}) props
  // _context is prepared in the call site; this allows Previews to behave differently to Surveys

  // TODO: change defaults behaviour.
  // Empty params reverting to defaults is annoying UX and sometimes prevents intentionally empty params
  // to be fair, such a change is probably more in the editor/backend than here when rendering;
  // the behaviour in ensureParamTypes is probably correct

  // Apply defaults for unset params, and coerce types and validate any set params
  const paramValues = ensureParamTypes(component.params, params);

  // TODO: manage passing results here too, when the platform does that again
  const results = {};

  return createElement(component, {
    ...{ ...params, ...paramValues }, // we also need to keep any custom editor param values (not specified in paramTypes)
    ...results,
    _context,
  });
};

const PageItemRender = (p) => (
  <ErrorBoundary resetOnPropChanges fallback={<PageItemRenderError />}>
    <PageItemRenderer {...p} />
  </ErrorBoundary>
);

export default PageItemRender;
