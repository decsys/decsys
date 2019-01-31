import { withTheme } from "styled-components";
import React from "react";
import { Button, Typography, Box } from "@smooth-ui/core-sc";
import { CaretDown, Rocket, TimesCircle } from "styled-icons/fa-solid";
import ActiveIndicator from "../../common/ActiveIndicator";

const RunCountBadge = ({ count }) => (
  <Box
    backgroundColor="info"
    display="inline-block"
    px=".5em"
    borderRadius="8px"
    color="white"
    mr="1em"
  >
    {count}
    <Box uiAs="span" display={{ xs: "none", md: "inline" }}>
      {" "}
      runs
    </Box>
  </Box>
);

const ToggleSurveyActiveButton = ({
  active,
  closeHandler,
  launchHandler,
  id
}) => (
  <Button
    display="inline-flex"
    alignItems="center"
    ml=".5em"
    variant={active ? "danger" : "success"}
    width="100px"
    onClick={() => (active ? closeHandler(id) : launchHandler(id))}
  >
    {active ? <TimesCircle size="1em" /> : <Rocket size="1em" />}
    <Box width="100%">{active ? "Close" : "Launch"}</Box>
  </Button>
);

const SurveyCard = props => (
  <Box
    display="flex"
    alignItems="stretch"
    variant={props.active ? "success" : "dark"}
    width="100%"
    borderBottom={`thin solid ${props.theme.gray400}`}
    backgroundColor="gray200"
  >
    <ActiveIndicator active={props.active} />

    <Box display="flex" width="100%" alignItems="center" p=".5em">
      <Typography variant="h5" mb={0}>
        {props.name}
      </Typography>

      <Box display="flex" alignItems="center" ml="auto">
        <RunCountBadge count={props.runCount} />

        <ToggleSurveyActiveButton {...props} />

        <Button
          display="inline-flex"
          justifyContent="space-evenly"
          alignItems="center"
          ml=".5em"
          variant="secondary"
          width="100px"
        >
          {/* Dropdown Button component */}
          Manage <CaretDown size="1em" />
        </Button>
      </Box>
    </Box>
  </Box>
);

export default withTheme(SurveyCard);
