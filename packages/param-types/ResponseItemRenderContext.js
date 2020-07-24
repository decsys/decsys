// provide constants relating to the ResponseItemRenderContext
// that is provided as a prop to ResponseItems when the Survey Platform renders them.

import PropTypes from "prop-types";

/**
 * PropTypes for the _context prop passed to Response Items
 */
export const propTypes = {
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
 * default values for functions on the `_context` prop
 * Reasonably speaking, only used by the Survey Platform,
 * as it guarantees them when ResponseItems are rendered.
 */
export const defaultProps = {
  setNextEnabled: () => {},
  logResults: () => {},
  logEvent: () => {},
};
