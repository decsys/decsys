import React, { useState } from "react";
import { FlexBox } from "../../components/ui";
import { Input, Button, Typography, Box } from "@smooth-ui/core-sc";
import { useNavigation } from "react-navi";
import { List } from "styled-icons/fa-solid";

const SurveyIdScreen = () => {
  const [id, setId] = useState("");
  const nav = useNavigation();

  const handleInputChange = e => {
    setId(e.target.value);
  };

  const handleSubmitClick = () => {
    nav.navigate(`/survey/${id}`);
  };

  return (
    <FlexBox flexDirection="column" alignItems="center" pt={100}>
      <Box mb={5}>
        <List size="250" />
      </Box>
      <Typography mb={3} variant="h2">
        Please enter a Survey ID to participate
      </Typography>
      <FlexBox>
        <Input
          size="lg"
          placeholder="Survey ID"
          onChange={handleInputChange}
          mr={2}
        />
        <Button size="lg" onClick={handleSubmitClick}>
          Submit
        </Button>
      </FlexBox>
    </FlexBox>
  );
};

export default SurveyIdScreen;
