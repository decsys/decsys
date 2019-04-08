import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FlexBox, ActiveIndicator, Badge } from "../ui";
import { Typography, Box } from "@smooth-ui/core-sc";
import RunCountBadge from "./RunCountBadge";
import { Grid, Cell } from "styled-css-grid";
import * as Buttons from "./SurveyCardButton";
import ManageSurveyButton from "./ManageSurveyButton";
import SurveyCardContext from "./Context";
import { encode } from "../../services/instance-id";
import { InfoCircle } from "styled-icons/fa-solid";

const SurveyCard = ({
  id,
  name,
  activeInstanceId,
  runCount = 0,
  allowLaunch = false
}) => {
  const { handleCloseClick, handleLaunchClick } = useContext(SurveyCardContext);

  // conditionally prep buttons beforehand
  const buttons = [];
  if (!!activeInstanceId) {
    buttons.push(
      <Buttons.Close onClick={() => handleCloseClick(id, activeInstanceId)} />
    );
    buttons.push(<Buttons.Dashboard id={id} />);
  }
  if (allowLaunch && !activeInstanceId)
    buttons.push(<Buttons.Launch onClick={() => handleLaunchClick(id)} />);
  if (runCount > 0) buttons.push(<Buttons.Results id={id} />);

  const friendlyId = !!activeInstanceId ? encode(id, activeInstanceId) : false;

  return (
    <FlexBox
      backgroundColor="cardBg"
      borderBottom="thin solid"
      borderColor="cardBorder"
    >
      <ActiveIndicator active={!!activeInstanceId} />

      <FlexBox flexDirection="column" width={1}>
        <Box
          p={1}
          borderBottom={!!activeInstanceId ? 1 : 0}
          borderColor="cardBorder"
        >
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

            {buttons.map((x, i) => (
              <Cell middle key={i}>
                {x}
              </Cell>
            ))}

            <Cell middle>
              <ManageSurveyButton id={id} name={name} editable={!runCount} />
            </Cell>
          </Grid>
        </Box>

        {!!activeInstanceId && (
          <FlexBox p={1} alignItems="center">
            <Typography fontWeight="bold" mx={1}>
              Survey ID:
            </Typography>
            <Typography mr={3}>{friendlyId}</Typography>
            <Typography fontWeight="bold" mr={1}>
              Share Link:
            </Typography>
            <Typography mr={2}>/survey/{friendlyId}</Typography>
            <Typography color="info">
              <InfoCircle size="1em" /> Remember to include your DECSYS server's
              address
            </Typography>
          </FlexBox>
        )}
      </FlexBox>
    </FlexBox>
  );
};

SurveyCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  activeInstanceId: PropTypes.number,
  runCount: PropTypes.number,
  allowLaunch: PropTypes.bool
};

export default SurveyCard;
