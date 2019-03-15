import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SortButton from "./SortButton";

const PureSortPanel = ({ keys, sortState, onSortButtonClick }) =>
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

PureSortPanel.propTypes = {
  keys: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  ).isRequired,
  sortState: PropTypes.shape({ key: PropTypes.string }).isRequired,
  onSortButtonClick: PropTypes.func.isRequired
};

const SortPanel = connect(
  null,
  dispatch => ({
    onSortButtonClick: key => asc => dispatch({ type: "REPLACE_ME" }) // TODO: action
  })
)(PureSortPanel);

export { PureSortPanel };

export default SortPanel;
