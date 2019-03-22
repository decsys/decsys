import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditorBar from "../../components/EditorBar";
import { Grid, Cell } from "styled-css-grid";
import { Typography } from "@smooth-ui/core-sc";
import { AlignLeft, CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";
import EditorToolbox from "../../components/EditorToolbox";
import EditorPageList from "../../components/EditorPageList";
import { LoadingIndicator, FlexBox } from "../../components/ui";
import {
  editName,
  deleteSurvey,
  duplicateSurvey
} from "../../state/ducks/editor";

const PureEditorScreen = ({
  id,
  survey,
  surveyLoaded,
  updateStates,
  components,
  onNameChange,
  onDeleteClick,
  onDuplicateClick
}) => {
  const SurveyEditorBar = ({ disabled }) => (
    <EditorBar
      id={id}
      name={survey.name || ""}
      nameUpdateState={updateStates.name}
      onNameChange={onNameChange}
      onDeleteClick={onDeleteClick}
      onDuplicateClick={onDuplicateClick}
      disabled={disabled}
    />
  );
  return !surveyLoaded ? (
    <FlexBox flexDirection="column">
      <SurveyEditorBar disabled />
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
        <SurveyEditorBar />
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
};

PureEditorScreen.propTypes = {
  id: PropTypes.number.isRequired,
  survey: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  surveyLoaded: PropTypes.bool,
  updateStates: PropTypes.shape({
    name: EditorBar.propTypes.nameUpdateState
  }),
  onNameChange: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

const EditorScreen = withRouter(
  connect(
    ({ editor: { survey, surveyLoaded, updateStates } }) => ({
      survey,
      surveyLoaded,
      updateStates,
      components: Object.keys(window.__DECSYS__.Components).map(name => ({
        type: name,
        icon: <AlignLeft size="1em" />
      }))
    }),
    (dispatch, { id }) => ({
      onNameChange: ({ target: { value } }) => dispatch(editName(id, value)),
      onDuplicateClick: () => dispatch(duplicateSurvey(id)),
      onDeleteClick: () => dispatch(deleteSurvey(id))
    })
  )(PureEditorScreen)
);

export { PureEditorScreen };

export default EditorScreen;
