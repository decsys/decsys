import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import SortButton from "./SortButton";
import SurveyListContext from "./SurveyListContext";
// import { sortSurveyList } from "../../state/ducks/surveys";

const SortPanel = ({ keys = [] }) => {
  const [state, setState] = useState({ key: "name" });

  const { sortSurveyList } = useContext(SurveyListContext);

  const handleSortButtonClick = key => {
    const asc = state.key === key ? !state[key] : state[key];
    sortSurveyList(key, asc);
    setState({
      ...state,
      key,
      [key]: asc
    });
  };

  const createSortButton = (label, key) => {
    return (
      <SortButton
        key={key}
        active={state.key === key}
        asc={state[key]}
        onClick={() => handleSortButtonClick(key)}
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
  ).isRequired
};

export default SortPanel;
