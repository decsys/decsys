import React from "react";
import { connect } from "react-redux";
import { Button, Box } from "@smooth-ui/core-sc";
import { TimesCircle, Rocket } from "styled-icons/fa-solid";
import { LaunchSession, CloseSession } from "./_actions";

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
  (dispatch, { active, id }) => ({
    onClick: () => dispatch(active ? CloseSession(id) : LaunchSession(id))
  })
)(ToggleSurveyActiveButton);

export default ToggleSurveyActiveButton;
