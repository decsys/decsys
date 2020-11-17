import React from "react";
import { Stack, Grid, useColorMode } from "@chakra-ui/react";
import { ActiveIndicator } from "components/core";
import SurveyInfoLine from "./SurveyInfoLine";
import ActionButtons, { getActionButtons } from "./ActionButtons";
import { listMatchingKeys } from "services/data-structures";
import { encode } from "services/instance-id";
import ManageSurveyMenu from "./ManageSurveyMenu";
import ActiveInstanceLine from "./ActiveInstanceLine";
import { useSurvey } from "../../../../contexts/Survey";
import themes, { defaultColorMode } from "themes";

const SurveyCard = () => {
  const { colorMode } = useColorMode();
  const style = themes.sharedStyles.card;
  const survey = useSurvey();
  const { id, activeInstanceId, runCount } = survey;
  const friendlyId = !!activeInstanceId ? encode(id, activeInstanceId) : "";

  const actionButtons = getActionButtons(survey);

  return (
    <Stack
      direction="row"
      spacing={0}
      {...style[colorMode || defaultColorMode]}
    >
      <ActiveIndicator active={!!activeInstanceId} />

      <Stack spacing={0} w="100%">
        <Grid
          borderBottom={activeInstanceId ? "thin solid" : "none"}
          borderColor={style[colorMode || defaultColorMode].borderColor}
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

          <ActionButtons
            actionButtons={actionButtons}
            {...survey}
            friendlyId={friendlyId}
          />

          <ManageSurveyMenu {...survey} editable={!runCount} />
        </Grid>

        {activeInstanceId && <ActiveInstanceLine friendlyId={friendlyId} />}
      </Stack>
    </Stack>
  );
};

export default SurveyCard;
