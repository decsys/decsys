import React from "react";
import { connect } from "react-redux";
import { Button } from "@smooth-ui/core-sc";
import { CaretDown, CaretUp } from "styled-icons/fa-solid";
import { sortSurveyList } from "./_ops";

const SortButton = ({ sortby, current, children, dispatch, ...rest }) => {
  const active = current.key === sortby;
  const { onClick: _, ...keep } = rest;
  return (
    <Button
      variant="white"
      fontWeight={active ? "bold" : "normal"}
      onClick={() =>
        dispatch(
          sortSurveyList(sortby, active ? !current[sortby] : current[sortby])
        )
      }
      {...keep}
    >
      {children}{" "}
      {current[sortby] ? <CaretUp size="1em" /> : <CaretDown size="1em" />}
    </Button>
  );
};

const SortButtonContainer = connect(state => ({
  current: state.admin.surveys.sort
}))(SortButton);

export { SortButton };
export default SortButtonContainer;
