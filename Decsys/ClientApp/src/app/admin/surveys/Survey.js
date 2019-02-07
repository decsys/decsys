import React from "react";
import { withTheme } from "styled-components";
import { Box, Button, Typography } from "@smooth-ui/core-sc";
import ToggleSurveyActiveButton from "./ToggleSurveyActiveButton";
import ActiveIndicator from "../../common/ActiveIndicator";
import RunCountBadge from "./RunCountBadge";
import { CaretDown } from "styled-icons/fa-solid";

const Survey = ({ name, active, runCount, id, theme }) => (
  <Box
    display="flex"
    alignItems="stretch"
    variant={active ? "success" : "dark"}
    width="100%"
    borderBottom={`thin solid ${theme.gray400}`}
    backgroundColor="gray200"
  >
    <ActiveIndicator isActive={active} />

    <Box display="flex" width="100%" alignItems="center" p=".5em">
      <Typography variant="h5" mb={0}>
        {name}
      </Typography>

      <Box display="flex" alignItems="center" ml="auto">
        <RunCountBadge count={runCount} />

        <ToggleSurveyActiveButton isActive={active} id={id} />

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

export default withTheme(Survey);
