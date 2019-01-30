import { withTheme } from "styled-components";
import React from "react";
import { Button, Typography, Box } from "@smooth-ui/core-sc";
import {
  CaretDown,
  Check,
  Times,
  Rocket,
  TimesCircle
} from "styled-icons/fa-solid";

const SurveyCard = props => (
  <Box
    display="flex"
    alignItems="stretch"
    variant={props.active ? "success" : "dark"}
    width="100%"
    borderBottom={`thin solid ${props.theme.gray400}`}
    backgroundColor="gray200"
  >
    <Box
      display="flex"
      alignItems="center"
      p=".5em"
      mr="1em"
      backgroundColor={props.active ? "success" : "gray700"}
      title={props.active ? "Active" : "Inactive"}
    >
      {props.active ? (
        <Check size="1em" color="white" />
      ) : (
        <Times size="1em" color="white" />
      )}
    </Box>

    <Box display="flex" width="100%" alignItems="center" p=".5em">
      <Typography variant="h5" mb={0}>
        {props.name}
      </Typography>

      <Box display="flex" alignItems="center" ml="auto">
        <Box
          backgroundColor="info"
          display="inline-block"
          px=".5em"
          borderRadius="8px"
          color="white"
          mr="1em"
        >
          {props.runCount}
          <Box uiAs="span" display={{ xs: "none", md: "inline" }}>
            {" "}
            runs
          </Box>
        </Box>

        <Button
          display="inline-flex"
          alignItems="center"
          ml=".5em"
          variant={props.active ? "danger" : "success"}
          width="100px"
        >
          {props.active ? <TimesCircle size="1em" /> : <Rocket size="1em" />}
          <Box width="100%">{props.active ? "Close" : "Launch"}</Box>
        </Button>

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
