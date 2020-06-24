import React from "react";
import { Flex, Switch, FormLabel } from "@chakra-ui/core";

const UseParticipantIdentifiersSwitch = ({ data, mutate }) => (
  <Flex mt={2} align="center">
    <Switch
      id="useParticipantIdentifiers"
      isChecked={data.useParticipantIdentifiers}
      onChange={({ target: { checked } }) =>
        mutate({ ...data, useParticipantIdentifiers: checked }, false)
      }
    />
    <FormLabel htmlFor="useParticipantIdentifiers" ml={1}>
      Require Participants to enter an identifier
    </FormLabel>
  </Flex>
);

export default UseParticipantIdentifiersSwitch;
