import React from "react";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import { connect } from "react-redux";
import ActiveIndicator from "../ui/ActiveIndicator";
import { Typography, Box } from "@smooth-ui/core-sc";
import RunCountBadge from "./RunCountBadge";
import { Grid, Cell } from "styled-css-grid";
import * as Buttons from "./SurveyCardButton";
import ManageSurveyButton from "./ManageSurveyButton";

const SurveyCard = ({
  id,
  name,
  active = false,
  runCount = 0,
  allowLaunch = false,
  onLaunchClick,
  onCloseClick
}) => {
  // conditionally prep buttons beforehand
  const buttons = [];
  if (active) {
    buttons.push(<Buttons.Close key="Close" onClick={onCloseClick} />);
    buttons.push(<Buttons.Dashboard id={id} key="Dashboard" />);
  }
  if (allowLaunch && !active)
    buttons.push(<Buttons.Launch key="Launch" onClick={onLaunchClick} />);
  if (runCount > 0) buttons.push(<Buttons.Results id={id} key="Results" />);

  return (
    <FlexBox
      backgroundColor="cardBg"
      borderBottom="thin solid"
      borderColor="cardBorder"
    >
      <ActiveIndicator active={active} />

      <Box width={1} p={1}>
        <Grid
          columns={`80px 1fr ${Array(buttons.length)
            .fill("100px")
            .join(" ")} auto`}
        >
          <Cell middle>
            <RunCountBadge count={runCount} />
          </Cell>

          <Cell middle>
            <Typography variant="h5" title={name} ml={1} mb={0.5}>
              {name}
            </Typography>
          </Cell>

          {buttons.map(x => (
            <Cell middle>{x}</Cell>
          ))}

          <Cell middle>
            <ManageSurveyButton id={id} name={name} editable={!runCount} />
          </Cell>
        </Grid>
      </Box>
    </FlexBox>
  );
};

SurveyCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  runCount: PropTypes.number,
  allowLaunch: PropTypes.bool
};

const SurveyCardContainer = connect(
  null,
  (dispatch, { id }) => ({
    onLaunchClick: () => dispatch({ type: "REPLACE_ME" }),
    onCloseClick: () => dispatch({ type: "REPLACE_ME" })
  })
);

export { SurveyCard };

export default SurveyCardContainer;
