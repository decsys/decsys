import React from "react";
import PropTypes from "prop-types";
import SortButton from "./SortButton";

export * from "./hooks";

const SortPanel = ({ keys = [], state, onSortButtonClick }) => {
  const createSortButton = (label, key) => {
    return (
      <SortButton
        key={key}
        active={state.key === key}
        asc={state[key]}
        onClick={() => onSortButtonClick(key)}
      >
        {label}
      </SortButton>
    );
  };

  return keys.map(sortKey => {
    return typeof sortKey === "string"
      ? createSortButton(sortKey, sortKey.toLocaleLowerCase())
      : createSortButton(sortKey[0], sortKey[1]);
  });
};

SortPanel.propTypes = {
  keys: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  ).isRequired,
  onSortButtonClick: PropTypes.func.isRequired
};

export default SortPanel;
