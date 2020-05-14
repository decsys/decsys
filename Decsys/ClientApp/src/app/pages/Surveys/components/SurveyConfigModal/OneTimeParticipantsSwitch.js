import React from "react";
import { Flex, Switch, FormLabel } from "@chakra-ui/core";

const OneTimeParticipantsSwitch = ({ data, mutate }) => (
  <Flex align="center">
    <Switch
      id="oneTimeParticipants"
      isChecked={data.oneTimeParticipants}
      onChange={({ target: { checked } }) =>
        mutate({ ...data, oneTimeParticipants: checked }, false)
      }
    />
    <FormLabel htmlFor="oneTimeParticipants" ml={1}>
      Restrict Participants to only taking the Survey once
    </FormLabel>
  </Flex>
);

export default OneTimeParticipantsSwitch;
