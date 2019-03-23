import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditorBar from "../../components/EditorBar";
import { Grid, Cell } from "styled-css-grid";
import { Typography } from "@smooth-ui/core-sc";
import EditorPageList from "../../components/EditorPageList";
import { LoadingIndicator, FlexBox } from "../../components/ui";
import {
  editName,
  deleteSurvey,
  duplicateSurvey,
  addPage
} from "../../state/ducks/editor";

const PureEditorScreen = ({
  id,
  survey,
  surveyLoaded,
  updateStates,
  components,
  onNameChange,
  onDeleteClick,
  onDuplicateClick,
  pageListActions,
  theme
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
      columns="1fr 2fr"
      rows="auto 1fr"
      rowGap="0px"
      columnGap="0px"
      areas={["bar bar", "pages config"]}
      style={{ height: "100vh" }}
    >
      <Cell area="bar">
        <SurveyEditorBar />
      </Cell>
      <Cell
        area="pages"
        style={{
          background: "gray300" // TODO:
        }}
      >
        <EditorPageList
          pages={survey.pages}
          components={components}
          actions={pageListActions}
        />
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
  id: PropTypes.string.isRequired,
  survey: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  surveyLoaded: PropTypes.bool,
  updateStates: PropTypes.shape({
    name: EditorBar.propTypes.nameUpdateState
  }),
  onNameChange: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  pageListActions: EditorPageList.propTypes.actions
};

const EditorScreen = withRouter(
  connect(
    ({ editor: { survey, surveyLoaded, updateStates } }) => ({
      survey,
      surveyLoaded,
      updateStates,
      components: Object.keys(window.__DECSYS__.Components).map(type => ({
        type,
        icon: window.__DECSYS__.Components[type].icon
      }))
    }),
    (dispatch, { id }) => ({
      onNameChange: ({ target: { value } }) => dispatch(editName(id, value)),
      onDuplicateClick: () => dispatch(duplicateSurvey(id)),
      onDeleteClick: () => dispatch(deleteSurvey(id)),
      pageListActions: {
        pageActions: {
          onRandomToggle: () => dispatch({ type: "SET_PAGE_RANDOM_STATE" }),
          onDuplicateClick: () => dispatch({ type: "DUPLICATE_PAGE" }),
          onDeleteClick: () => dispatch({ type: "DELETE_PAGE" }),
          onHeadingClick: () => dispatch({ type: "ADD_PAGE_HEADING" }),
          onParagraphClick: () => dispatch({ type: "ADD_PAGE_PARAGRAPH" }),
          onImageClick: () => dispatch({ type: "ADD_PAGE_IMAGE" })
        },
        itemActions: {
          onDuplicateClick: () => dispatch({ type: "DUPLICATE_PAGE_ITEM" }),
          onDeleteClick: () => dispatch({ type: "DELETE_PAGE_ITEM" })
        },
        onComponentSelect: () => dispatch({ type: "SELECT_PAGE_COMPONENT" }),
        onAddClick: () => dispatch(addPage(id))
      }
    })
  )(PureEditorScreen)
);

export { PureEditorScreen };

export default EditorScreen;
