import React from "react";
import { withTheme } from "styled-components";
import { Typography, Box, Button } from "@smooth-ui/core-sc";
import { Link } from "react-router-dom";
import ToggleSurveyActiveButton from "./ToggleSurveyActiveButton";
import ActiveIndicator from "../../common/ActiveIndicator";
import RunCountBadge from "./RunCountBadge";
import FlexBox from "../../common/FlexBox";
import { Grid, Cell } from "styled-css-grid";
import ManageSurveyButton from "./ManageSurveyButton";

const Survey = ({ name, active, runCount, id, allowLaunch, theme }) => (
  <FlexBox
    alignItems="stretch"
    variant={active ? "success" : "dark"}
    borderBottom={`thin solid ${theme.gray400}`}
    backgroundColor="gray200"
  >
    <ActiveIndicator isActive={active} />

    <Box width="100%" p={1}>
      <Grid
        justifyContent="stretch"
        columns={`80px 1fr${allowLaunch || active ? " 100px" : ""}${
          active ? " 100px" : ""
        }${runCount > 0 ? " 100px" : ""} auto`}
      >
        <Cell middle>
          <RunCountBadge count={runCount} />
        </Cell>

        <Cell middle>
          <Typography title={name} variant="h5" mb={0} ml={1}>
            {name}
          </Typography>
        </Cell>

        {(allowLaunch || active) && (
          <Cell middle>
            <ToggleSurveyActiveButton isActive={active} id={id} />
          </Cell>
        )}

        {active && (
          <Cell middle>
            <Button variant="success" uiAs={Link} to={`survey/${id}/dashboard`}>
              Dashboard
            </Button>
          </Cell>
        )}

        {runCount > 0 && (
          <Cell middle>
            <Button
              textAlign="center"
              variant="secondary"
              uiAs={Link}
              to={`survey/${id}/results`}
            >
              Results
            </Button>
          </Cell>
        )}

        <Cell middle>
          <ManageSurveyButton {...{ runCount, id, name }} />
        </Cell>
      </Grid>
    </Box>
  </FlexBox>
);

export default withTheme(Survey);
