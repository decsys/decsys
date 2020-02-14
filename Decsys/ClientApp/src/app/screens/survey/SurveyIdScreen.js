import React, { useState } from "react";
import { FlexBox } from "components/ui";
import { Input, Button, Typography, Box } from "@smooth-ui/core-sc";
import { useNavigation } from "react-navi";
import { List } from "styled-icons/fa-solid";
import AboutLink from "components/AboutLink";
import AppBar from "components/AppBar";

const SurveyIdScreen = () => {
  const [id, setId] = useState("");
  const nav = useNavigation();

  const handleInputChange = e => {
    setId(e.target.value);
  };

  const handleSubmitClick = e => {
    e.preventDefault();
    nav.navigate(`/survey/${id}`);
  };

  return (
    <>
      <AppBar brand="DECSYS">
        <AboutLink />
      </AppBar>
      <FlexBox flexDirection="column" alignItems="center" pt={100}>
        <Box mb={5}>
          <List size="250" />
        </Box>
        <Typography mb={3} variant="h2">
          Please enter a Survey ID to participate
        </Typography>
        <FlexBox>
          <form>
            <Input
              size="lg"
              placeholder="Survey ID"
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

export default SurveyIdScreen;
