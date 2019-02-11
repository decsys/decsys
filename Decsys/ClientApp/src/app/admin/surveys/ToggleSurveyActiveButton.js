import React from "react";
import { connect } from "react-redux";
import { Button, Box } from "@smooth-ui/core-sc";
import { TimesCircle, Rocket } from "styled-icons/fa-solid";
import { LaunchSession, CloseSession } from "./_actions";

let ToggleSurveyActiveButton = ({ onClick, isActive }) => (
  <Button
    display="inline-flex"
    alignItems="center"
    variant={isActive ? "danger" : "success"}
    onClick={onClick}
  >
    {isActive ? <TimesCircle size="1em" /> : <Rocket size="1em" />}
    <Box width="100%">{isActive ? "Close" : "Launch"}</Box>
  </Button>
);

ToggleSurveyActiveButton = connect(
  null,
  (dispatch, { isActive, id }) => ({
    onClick: () => dispatch(isActive ? CloseSession(id) : LaunchSession(id))
  })
)(ToggleSurveyActiveButton);

export default ToggleSurveyActiveButton;
