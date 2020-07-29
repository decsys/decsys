// provide constants relating to the ResponseItem Contexts
// that the Survey Platform passes when rendering Response Items
// or their custom editors

import PropTypes from "prop-types";

/**
 * PropTypes for the _context prop passed when rendering Response Items
 */
export const renderContextPropTypes = {
  _context: PropTypes.shape({
    surveyId: PropTypes.number.isRequired,
    itemId: PropTypes.string.isRequired,
    pageId: PropTypes.string.isRequired,
    setNextEnabled: PropTypes.func.isRequired,
    logResults: PropTypes.func.isRequired,
    logEvent: PropTypes.func.isRequired,
  }).isRequired,
};

/**
 * PropTypes for the _context prop passed to Response Items' `paramsEditorComponent`
 */
export const paramsEditorContextPropTypes = {
  _context: PropTypes.shape({
    surveyId: PropTypes.number.isRequired,
    itemId: PropTypes.string.isRequired,
    pageId: PropTypes.string.isRequired,
    handleParamChange: PropTypes.func.isRequired,
    ParamsEditor: PropTypes.element.isRequired,
  }).isRequired,
};

/**
 * PropTypes for the _context prop passed to Response Items' `previewEditorComponent`
 */
export const previewEditorContextPropTypes = {
  _context: PropTypes.shape({
    surveyId: PropTypes.number.isRequired,
    itemId: PropTypes.string.isRequired,
    pageId: PropTypes.string.isRequired,
    handleParamChange: PropTypes.func.isRequired,
  }).isRequired,
};

/**
 * default values for functions on the `_context` prop
 * Reasonably speaking, only used by the Survey Platform,
 * as it guarantees them when ResponseItems are rendered.
 */
export const renderContextDefaults = {
  setNextEnabled: () => {},
  logResults: () => {},
  logEvent: () => {},
};
