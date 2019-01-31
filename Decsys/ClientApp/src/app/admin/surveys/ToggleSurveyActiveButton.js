import React from "react";
import { connect } from "react-redux";
import { Button, Box } from "@smooth-ui/core-sc";
import { TimesCircle, Rocket } from "styled-icons/fa-solid";
import * as Types from "../../common/_types";

let ToggleSurveyActiveButton = ({ onClick, active }) => (
  <Button
    display="inline-flex"
    alignItems="center"
    ml=".5em"
    variant={active ? "danger" : "success"}
    width="100px"
    onClick={onClick}
  >
    {active ? <TimesCircle size="1em" /> : <Rocket size="1em" />}
    <Box width="100%">{active ? "Close" : "Launch"}</Box>
  </Button>
);

ToggleSurveyActiveButton = connect(
  null,
  (dispatch, ownProps) => ({
    onClick: () =>
      dispatch({
        type: ownProps.active ? Types.CLOSE_SESSION : Types.LAUNCH_SESSION,
        id: ownProps.id
      })
  })
)(ToggleSurveyActiveButton);

export default ToggleSurveyActiveButton;
