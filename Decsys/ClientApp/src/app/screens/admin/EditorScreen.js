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
  addPage,
  deletePage,
  addPageItem,
  deletePageItem,
  duplicatePage,
  duplicatePageItem,
  selectPageComponent,
  reorderPage
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
          onDuplicateClick: pageId => dispatch(duplicatePage(id, pageId)),
          onDeleteClick: pageId => dispatch(deletePage(id, pageId)),
          onAddPageItemClick: (pageId, type) =>
            dispatch(addPageItem(id, pageId, type))
        },
        itemActions: {
          onDuplicateClick: (pageId, componentId) =>
            dispatch(duplicatePageItem(id, pageId, componentId)),
          onDeleteClick: (pageId, componentId) =>
            dispatch(deletePageItem(id, pageId, componentId))
        },
        onComponentSelect: (pageId, type, componentId, order) =>
          dispatch(selectPageComponent(id, pageId, type, componentId, order)),
        onAddClick: () => dispatch(addPage(id)),
        onDragEnd: (pageId, newOrder) =>
          dispatch(reorderPage(id, pageId, newOrder))
      }
    })
  )(PureEditorScreen)
);

export { PureEditorScreen };

export default EditorScreen;
