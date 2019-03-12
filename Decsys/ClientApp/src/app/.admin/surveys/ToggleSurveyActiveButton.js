import React from "react";
import { connect } from "react-redux";
import { Button, Box } from "@smooth-ui/core-sc";
import { TimesCircle, Rocket } from "styled-icons/fa-solid";
import { LaunchSession, CloseSession } from "./_actions";

const ToggleSurveyActiveButton = ({ onClick, active }) => (
  <Button
    display="inline-flex"
    alignItems="center"
    variant={active ? "danger" : "success"}
    onClick={onClick}
  >
    {active ? <TimesCircle size="1em" /> : <Rocket size="1em" />}
    <Box width="100%">{active ? "Close" : "Launch"}</Box>
  </Button>
);

const ToggleSurveyActiveButtonContainer = connect(
  null,
  (dispatch, { active, id }) => ({
    onClick: () => dispatch(active ? CloseSession(id) : LaunchSession(id))
  })
)(ToggleSurveyActiveButton);

export { ToggleSurveyActiveButton };
export default ToggleSurveyActiveButtonContainer;
