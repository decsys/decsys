import React from "react";
import { Stack, Grid } from "@chakra-ui/core";
import { ActiveIndicator } from "components/core";
import SurveyInfoLine from "./SurveyInfoLine";
import ActionButtons, { getActionButtons } from "./ActionButtons";
import { listMatchingKeys } from "services/data-structures";
import { encode } from "services/instance-id";
import ManageSurveyMenu from "./ManageSurveyMenu";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";

const SurveyCard = ({ survey }) => {
  const { id, activeInstanceId, runCount } = survey;
  const friendlyId = !!activeInstanceId ? encode(id, activeInstanceId) : false;

  const actionButtons = getActionButtons(survey);

  const { launch, close } = useSurveyCardActions();
  const handleLaunch = () => launch(id);
  const handleClose = () => close(id, activeInstanceId);

  return (
    <Stack
      isInline
      key={id}
      borderBottom="thin solid"
      borderColor="gray.300"
      bg="gray.100"
      pr={2}
    >
      <ActiveIndicator active={!!activeInstanceId} />

      <Stack gap={1} w="100%">
        <Grid
          gap={2}
          templateColumns={`80px 1fr ${Array(
            listMatchingKeys(actionButtons).length
          )
            .fill("100px")
            .join(" ")} auto`}
          py={2}
          alignContent="center"
        >
          <SurveyInfoLine {...survey} />

          <ActionButtons
            {...survey}
            friendlyId={friendlyId}
            actionButtons={actionButtons}
            onLaunch={handleLaunch}
            onClose={handleClose}
          />

          <ManageSurveyMenu {...survey} editable={!runCount} />
        </Grid>

        {/* <ActiveInstanceLine /> */}
      </Stack>

      {/* <FlexBox flexDirection="column" width={1}>
          <Box
            p={1}
            borderBottom={!!activeInstanceId ? 1 : 0}
            borderColor="cardBorder"
          >
          ...
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
                onClick={handleViewParticipantIdsClick}
              >
                View Valid Participant Identifiers
              </Button>
            </FlexBox>
          )}
        </FlexBox> */}
    </Stack>
  );
};

export default SurveyCard;
