import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FlexBox, ActiveIndicator } from "../ui";
import { Typography, Box, Button } from "@smooth-ui/core-sc";
import RunCountBadge from "./RunCountBadge";
import { Grid, Cell } from "styled-css-grid";
import * as Buttons from "./SurveyCardButton";
import ManageSurveyButton from "./ManageSurveyButton";
import SurveyCardContext from "./Context";
import { encode } from "../../services/instance-id";
import { InfoCircle } from "styled-icons/fa-solid";
import { useModal } from "../ui/ConfirmModal";

const SurveyCard = ({
  id,
  name,
  activeInstanceId,
  runCount = 0,
  allowLaunch = false
}) => {
  const { handleCloseClick, handleLaunchClick } = useContext(SurveyCardContext);
  const participantIdModal = useModal();

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
    <>
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
                <InfoCircle size="1em" /> Remember to include your DECSYS
                server's address
              </Typography>
              <Button
                size="sm"
                ml="auto"
                variant="light"
                border={1}
                borderColor="info"
                color="info"
                backgroundColor="lightest"
              >
                View Valid Participant Identifiers
              </Button>
            </FlexBox>
          )}
        </FlexBox>
      </FlexBox>
      {/* <ConfirmModal
        forceUpdate={useParticipantIdentifiers}
        {...participantIdModal}
        header={`${friendlyId} valid participant identifiers`}
      >
        {(!currentConfigLoaded && <LoadingIndicator />) || (
          <FlexBox flexDirection="column">
            <FlexBox>
              <Switch
                checked={oneTimeParticipants}
                onChange={({ target: { checked } }) =>
                  setOneTimeParticipants(checked)
                }
              />
              <Typography ml={1}>
                Restrict Participants to only taking the Survey once
              </Typography>
            </FlexBox>

            <FlexBox mt={2}>
              <Switch
                checked={useParticipantIdentifiers}
                onChange={({ target: { checked } }) =>
                  setUseParticipantIdentifiers(checked)
                }
              />
              <Typography ml={1}>
                Require Participants to enter an identifier
              </Typography>
            </FlexBox>

            {useParticipantIdentifiers && (
              <>
                <Typography fontWeight="bold" mt={1}>
                  Valid Participant Identifiers
                </Typography>

                <FlexBox alignItems="center" my={1} ml={2}>
                  <InfoIcon size="2em" />
                  <FlexBox flexDirection="column" ml={2}>
                    <Typography color="info">
                      • Restrict Survey access to only these Identifiers
                    </Typography>
                    <Typography color="info">
                      • One Identifier per line
                    </Typography>
                    <Typography color="info">
                      • Leave empty to require participants to enter a unique
                      identifier
                    </Typography>
                  </FlexBox>
                </FlexBox>

                <FlexBox mb={1}>
                  <Input
                    size="sm"
                    type="number"
                    value={idGenCount}
                    onChange={handleGenCountChange}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleIdGenClick}
                  >
                    Generate Random IDs
                  </Button>
                </FlexBox>

                <Textarea
                  rows={6}
                  value={validIdentifiers.join("\n")}
                  onChange={({ target: { value } }) =>
                    setValidIdentifiers(value.split("\n"))
                  }
                />
              </>
            )}
          </FlexBox>
        )}
      </ConfirmModal> */}
    </>
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
