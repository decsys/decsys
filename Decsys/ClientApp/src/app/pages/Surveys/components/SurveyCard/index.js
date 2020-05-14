import React from "react";
import { Stack, Grid } from "@chakra-ui/core";
import { ActiveIndicator } from "components/core";
import SurveyInfoLine from "./SurveyInfoLine";
import ActionButtons, { getActionButtons } from "./ActionButtons";
import { listMatchingKeys } from "services/data-structures";
import { encode } from "services/instance-id";
import ManageSurveyMenu from "./ManageSurveyMenu";
import ActiveInstanceLine from "./ActiveInstanceLine";
import { useSurvey } from "../../contexts/Survey";

const SurveyCard = () => {
  const survey = useSurvey();
  const { id, activeInstanceId, runCount } = survey;
  const friendlyId = !!activeInstanceId ? encode(id, activeInstanceId) : "";

  const actionButtons = getActionButtons(survey);

  return (
    <Stack
      isInline
      spacing={0}
      borderBottom="thin solid"
      borderColor="gray.300"
      bg="gray.100"
    >
      <ActiveIndicator active={!!activeInstanceId} />

      <Stack spacing={0} w="100%">
        <Grid
          gap={2}
          templateColumns={`80px 1fr ${Array(
            listMatchingKeys(actionButtons).length
          )
            .fill("100px")
            .join(" ")} auto`}
          p={2}
          alignContent="center"
        >
          <SurveyInfoLine {...survey} />

          <ActionButtons actionButtons={actionButtons} {...survey} />

          <ManageSurveyMenu {...survey} editable={!runCount} />
        </Grid>

        {activeInstanceId && <ActiveInstanceLine friendlyId={friendlyId} />}
      </Stack>
    </Stack>
  );
};

export default SurveyCard;
