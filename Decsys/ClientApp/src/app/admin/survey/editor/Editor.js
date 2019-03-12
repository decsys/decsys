import React from "react";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import SurveyEditorBar from "./SurveyEditorBar";
import { Grid, Cell } from "styled-css-grid";
import FlexBox from "../../../common/FlexBox";
import { Typography, Switch } from "@smooth-ui/core-sc";
import { AlignLeft, CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";

const ComponentTool = withTheme(({ icon, name, theme }) => (
  <Typography
    py={1}
    px={2}
    border={1}
    borderColor={theme.gray400}
    backgroundColor={theme.gray100}
  >
    {icon} {name}
  </Typography>
));

const Toolbox = withTheme(({ components, theme }) => (
  <FlexBox flexDirection="column" px={2}>
    <Typography textAlign="center" width={1} p={1}>
      Components
    </Typography>
    {components.map(({ type, icon }) => (
      <ComponentTool key={type} name={type} icon={icon} />
    ))}
  </FlexBox>
));

const Page = withTheme(({ fixedPage, n, icon, random, title, type, theme }) => (
  <FlexBox
    flexDirection="column"
    border={1}
    borderColor={theme.gray200}
    backgroundColor={theme.white}
  >
    <FlexBox>
      {!fixedPage && (
        <Grid
          style={{
            padding: ".5em",
            borderRight: `.5em solid ${theme.gray200}`
          }}
          columns="1fr 1fr"
          rows="1fr 1fr"
          areas={["number icon", "random random"]}
        >
          <Cell>Q{n}</Cell>
          <Cell>{icon}</Cell>
          <Cell area="random">
            <FlexBox flexDirection="column" alignItems="center">
              <Switch labeled />
              Random
            </FlexBox>
          </Cell>
        </Grid>
      )}
      <FlexBox flexDirection="column" p={1}>
        <Typography color="gray600">{type}</Typography>
        <Typography>{title}</Typography>
      </FlexBox>
    </FlexBox>
  </FlexBox>
));

const PageList = () => (
  <FlexBox flexDirection="column" px={2}>
    <Typography textAlign="center" width={1} p={1}>
      Survey structure
    </Typography>
    <Page type="Welcome" title="Welcome" fixedPage />
    <Page
      type="Ellipse"
      title="What's the difference between a duck?"
      icon={<CircleNotch size="1em" />}
      n={1}
      random={false}
    />
    <Page
      type="Likert"
      title="Which radio button is your favourite?"
      icon={<DotCircle size="1em" />}
      n={2}
      random
    />
    <Page type="ThankYou" title="Thank you" fixedPage />
  </FlexBox>
);

let Editor = withTheme(({ survey, components, theme }) => (
  <Grid
    columns="240px 1fr 2fr"
    rows="auto 1fr"
    rowGap="0px"
    columnGap="0px"
    areas={["bar bar bar", "toolbox pages config"]}
    style={{ height: "100vh" }}
  >
    <Cell area="bar">
      <SurveyEditorBar name={survey.name} />
    </Cell>
    <Cell area="toolbox" style={{ background: theme.gray500 }}>
      <Toolbox components={components} />
    </Cell>
    <Cell area="pages" style={{ background: theme.gray300 }}>
      <PageList />
    </Cell>
    <Cell area="config">
      <div>Hello</div>
    </Cell>
  </Grid>
));

Editor = connect((state, { match }) => ({
  survey: state.data.surveys[match.params.id],
  components: [
    { type: "Ellipse", icon: <CircleNotch size="1em" /> },
    { type: "Likert", icon: <DotCircle size="1em" /> },
    { type: "FreeText", icon: <AlignLeft size="1em" /> }
  ]
}))(Editor);

export default Editor;
