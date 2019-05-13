import React from "react";
import { Container, FlexBox } from "../../components/ui";
import { Typography, Button } from "@smooth-ui/core-sc";
import { surveyExport } from "../../services/export";
import { useCurrentRoute } from "react-navi";

const ExportScreen = () => {
  const { survey } = useCurrentRoute().data;
  const handleExportStructure = () => surveyExport(survey, "structure");
  const handleExportFull = () => surveyExport(survey, "full");

  return (
    <Container>
      <FlexBox flexDirection="column">
        <Typography variant="h1">Export Survey {survey.name}</Typography>
        <Button onClick={handleExportStructure}>
          Export Survey Structure Only
        </Button>
        <Button onClick={handleExportFull}>
          Export Survey Structure and Full Response Data
        </Button>
      </FlexBox>
    </Container>
  );
};

export default ExportScreen;
