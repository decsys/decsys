import React from "react";
import { connect } from "react-redux";
import { Button } from "@smooth-ui/core-sc";
import { CaretDown, CaretUp } from "styled-icons/fa-solid";
import { sortSurveyList } from "./_ops";

let SortButton = ({ sortby, current, children, dispatch }) => {
  const active = current.key === sortby;
  return (
    <Button
      variant="white"
      fontWeight={active ? "bold" : "normal"}
      onClick={() =>
        dispatch(
          sortSurveyList(sortby, active ? !current[sortby] : current[sortby])
        )
      }
    >
      {children}{" "}
      {current[sortby] ? <CaretUp size="1em" /> : <CaretDown size="1em" />}
    </Button>
  );
};

SortButton = connect(state => ({
  current: state.admin.surveys.sort
}))(SortButton);

export default SortButton;
