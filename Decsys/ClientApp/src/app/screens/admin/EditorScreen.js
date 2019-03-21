import React from "react";
import { connect } from "react-redux";
import SurveyEditorBar from "../../components/EditorBar";
import { Grid, Cell } from "styled-css-grid";
import { Typography } from "@smooth-ui/core-sc";
import { AlignLeft, CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";
import EditorToolbox from "../../components/EditorToolbox";
import EditorPageList from "../../components/EditorPageList";
import { LoadingIndicator, FlexBox } from "../../components/ui";
import { editSurveyName } from "../../state/ducks/editor";

const PureEditorScreen = ({
  survey,
  surveyLoaded,
  updateStates,
  components,
  onNameChange
}) =>
  !surveyLoaded ? (
    <FlexBox flexDirection="column">
      <SurveyEditorBar
        name={survey.name}
        nameUpdateState={updateStates.name}
        onNameChange={onNameChange}
        disabled
      />
      <LoadingIndicator />
    </FlexBox>
  ) : (
    <Grid
      columns="240px 2fr 3fr"
      rows="auto 1fr"
      rowGap="0px"
      columnGap="0px"
      areas={["bar bar bar", "toolbox pages config"]}
      style={{ height: "100vh" }}
    >
      <Cell area="bar">
        <SurveyEditorBar
          name={survey.name}
          onNameChange={onNameChange}
          nameUpdateState={updateStates.name}
        />
      </Cell>
      <Cell
        area="toolbox"
        style={{
          background: "gray500" // TODO:
        }}
      >
        <EditorToolbox components={components} />
      </Cell>
      <Cell
        area="pages"
        style={{
          background: "gray300" // TODO:
        }}
      >
        <EditorPageList />
      </Cell>
      <Cell area="config">
        <FlexBox>
          <Typography p={1} width={1} textAlign="center">
            Hello
          </Typography>
        </FlexBox>
      </Cell>
    </Grid>
  );

const EditorScreen = connect(
  ({ editor: { survey, surveyLoaded, updateStates } }) => ({
    survey,
    surveyLoaded,
    updateStates,
    components: [
      { type: "Ellipse", icon: <CircleNotch size="1em" /> },
      { type: "Likert", icon: <DotCircle size="1em" /> },
      { type: "FreeText", icon: <AlignLeft size="1em" /> }
    ]
  }),
  (dispatch, { id }) => ({
    onNameChange: ({ target: { value } }) => dispatch(editSurveyName(id, value))
  })
)(PureEditorScreen);

export { PureEditorScreen };

export default EditorScreen;
