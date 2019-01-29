import { withTheme } from "styled-components";
import React from "react";
import { Button, Typography, Box } from "@smooth-ui/core-sc";
import { CaretDown, Check, Times } from "styled-icons/fa-solid";

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
      <Box ml="auto">
        <Box
          backgroundColor="info"
          display="inline-block"
          px=".5em"
          borderRadius="8px"
          color="white"
        >
          {props.runCount} runs
        </Box>
        <Button ml=".5em" variant="success">
          Launch
        </Button>
        <Button ml=".5em" variant="secondary">
          {/* Dropdown Button component */}
          Manage <CaretDown size="1em" />
        </Button>
      </Box>
    </Box>
  </Box>
);

export default withTheme(SurveyCard);
