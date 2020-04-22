import React, { useState } from "react";
import { FlexBox } from "components/core";
import { Input, Button, Typography, Box, Alert } from "@smooth-ui/core-sc";
import { useNavigation } from "react-navi";
import { List } from "styled-icons/fa-solid";
import AboutLink from "components/AboutLink";
import AppBar from "components/AppBar";

const ParticipantIdScreen = ({ combinedId, users, validIdentifiers }) => {
  const [id, setId] = useState("");
  const [validationError, setValidationError] = useState("");
  const nav = useNavigation();

  const handleInputChange = e => {
    setId(e.target.value);
  };

  const handleSubmitClick = e => {
    e.preventDefault();
    if (validIdentifiers.length > 0 && !validIdentifiers.includes(id)) {
      setValidationError(
        "The Participant ID entered was not accepted for accessing this Survey."
      );
      return;
    }
    users.storeInstanceParticipantId(combinedId, id);
    nav.navigate(`/survey/${combinedId}`);
  };

  return (
    <>
      <AppBar brand="DECSYS">
        <AboutLink />
      </AppBar>
      <FlexBox flexDirection="column" alignItems="center" pt={100}>
        {validationError ? (
          <Alert variant="danger">{validationError}</Alert>
        ) : null}

        <Box mb={5}>
          <List size="250" />
        </Box>

        <Typography mb={3} variant="h2">
          Please enter a Participant ID to participate
        </Typography>

        <FlexBox>
          <form>
            <Input
              size="lg"
              placeholder="Participant ID"
              onChange={handleInputChange}
              mr={2}
            />
            <Button size="lg" onClick={handleSubmitClick}>
              Submit
            </Button>
          </form>
        </FlexBox>
      </FlexBox>
    </>
  );
};

export default ParticipantIdScreen;
