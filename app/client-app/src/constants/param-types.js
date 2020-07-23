import PropTypes from "prop-types";

// TODO: move these to param-types.
// https://github.com/decsys/param-types/issues/8

export const propTypes = {
  surveyId: PropTypes.number.isRequired,
  itemId: PropTypes.string.isRequired,
  setNextEnabled: PropTypes.func.isRequired,
  logResults: PropTypes.func.isRequired,
  logEvent: PropTypes.func.isRequired
};

export const defaultProps = {
  setNextEnabled: () => {},
  logResults: () => {},
  logEvent: () => {}
};
