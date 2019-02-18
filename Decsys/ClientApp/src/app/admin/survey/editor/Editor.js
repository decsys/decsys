import React from "react";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import SurveyEditorBar from "./SurveyEditorBar";
import { Grid, Cell } from "styled-css-grid";
import FlexBox from "../../../common/FlexBox";
import { Typography } from "@smooth-ui/core-sc";

const ComponentTool = withTheme(({ name, theme }) => (
  <Typography m={1} p={1} borderRadius={5} border={1}>
    {name}
  </Typography>
));

const Toolbox = ({ components }) => (
  <FlexBox flexDirection="column">
    <Typography textAlign="center" width={1}>
      Components
    </Typography>
    {components.map(component => (
      <ComponentTool key={component} name={component} />
    ))}
  </FlexBox>
);

const Page = ({ title, type }) => (
  <FlexBox flexDirection="column" m={1} p={1} borderRadius={0} border={1}>
    <Typography color="gray600">{type}</Typography>
    <Typography>{title}</Typography>
  </FlexBox>
);

const PageList = () => (
  <FlexBox flexDirection="column">
    <Typography textAlign="center" width={1}>
      Survey structure
    </Typography>
    <Page type="Welcome page" title="Welcome" />
    <Page type="Ellipse" title="What's the difference between a duck?" />
    <Page type="Likert" title="Which radio button is your favourite?" />
    <Page type="Thank you page" title="Thank you" />
  </FlexBox>
);

let Editor = ({ survey, components }) => (
  <Grid
    columns="240px 1fr 2fr"
    rows="auto 1fr"
    rowGap="0px"
    areas={["bar bar bar", "toolbox pages config"]}
  >
    <Cell area="bar">
      <SurveyEditorBar name={survey.name} />
    </Cell>
    <Cell area="toolbox">
      <Toolbox components={components} />
    </Cell>
    <Cell area="pages">
      <PageList />
    </Cell>
    <Cell area="config">
      <div>Hello</div>
    </Cell>
  </Grid>
);

Editor = connect((state, { match }) => ({
  survey: state.data.surveys[match.params.id],
  components: ["Ellipse", "Likert", "FreeText"]
}))(Editor);

export default Editor;
