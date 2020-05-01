import React from "react";
import { Stack, Grid } from "@chakra-ui/core";
import { ActiveIndicator } from "components/core";
import SurveyInfoLine from "./SurveyInfoLine";
import ActionButtons, { getActionButtons } from "./ActionButtons";
import { listMatchingKeys } from "services/data-structures";
import { encode } from "services/instance-id";
import ManageSurveyMenu from "./ManageSurveyMenu";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";
import ActiveInstanceLine from "./ActiveInstanceLine";

const SurveyCard = ({ survey }) => {
  const { id, activeInstanceId, runCount } = survey;
  const friendlyId = !!activeInstanceId ? encode(id, activeInstanceId) : "";

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

        {activeInstanceId && <ActiveInstanceLine friendlyId={friendlyId} />}
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
            
          )}
        </FlexBox> */}
    </Stack>
  );
};

export default SurveyCard;
