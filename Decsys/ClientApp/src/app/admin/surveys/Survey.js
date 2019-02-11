import React from "react";
import { withTheme } from "styled-components";
import { Typography, Box } from "@smooth-ui/core-sc";
import ToggleSurveyActiveButton from "./ToggleSurveyActiveButton";
import ActiveIndicator from "../../common/ActiveIndicator";
import RunCountBadge from "./RunCountBadge";
import FlexBox from "../../common/FlexBox";
import { Grid, Cell } from "styled-css-grid";
import ManageSurveyButton from "./ManageSurveyButton";

const Survey = ({ name, active, runCount, id, theme }) => (
  <FlexBox
    alignItems="stretch"
    variant={active ? "success" : "dark"}
    borderBottom={`thin solid ${theme.gray400}`}
    backgroundColor="gray200"
  >
    <ActiveIndicator isActive={active} />

    <Box width="100%" p={1} ml={1}>
      <Grid justifyContent="stretch" columns={"1fr auto 100px 100px"}>
        <Cell middle>
          <Typography variant="h5" mb={0}>
            {name}
          </Typography>
        </Cell>

        <Cell middle>
          <RunCountBadge count={runCount} />
        </Cell>

        <Cell middle>
          <ToggleSurveyActiveButton isActive={active} id={id} />
        </Cell>

        <Cell middle>
          <ManageSurveyButton {...{ runCount, id }} />
        </Cell>
      </Grid>
    </Box>
  </FlexBox>
);

export default withTheme(Survey);
