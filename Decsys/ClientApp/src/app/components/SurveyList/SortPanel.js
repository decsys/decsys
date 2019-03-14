import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SortButton from "./SortButton";

const SortPanel = ({ keys, sortState, onSortButtonClick }) =>
  (keys || []).map(sortKey => {
    const button = (label, key) => {
      return (
        <SortButton
          key={key}
          active={sortState.key === key}
          asc={sortState[key]}
          onClick={onSortButtonClick(key)}
        >
          {label}
        </SortButton>
      );
    };
    return typeof sortKey === "string"
      ? button(sortKey, sortKey.toLocaleLowerCase())
      : button(sortKey[0], sortKey[1]);
  });

SortPanel.propTypes = {
  keys: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  ).isRequired,
  sortState: PropTypes.shape({ key: PropTypes.string }).isRequired,
  onSortButtonClick: PropTypes.func.isRequired
};

const SortPanelContainer = connect(
  state => ({
    sortState: state.fixMe // TODO: state
  }),
  dispatch => ({
    onSortButtonClick: key => asc => dispatch({ type: "REPLACE_ME" }) // TODO: action
  })
)(SortPanel);

export { SortPanel };

export default SortPanelContainer;
