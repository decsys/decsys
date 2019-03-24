import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditorBar from "../../components/EditorBar";
import { Grid, Cell } from "styled-css-grid";
import EditorPageList from "../../components/EditorPageList";
import { LoadingIndicator, FlexBox, EmptyState } from "../../components/ui";
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
  changePageComponent,
  reorderPage,
  reorderComponent,
  setCurrentComponent
} from "../../state/ducks/editor";
import { FileAlt } from "styled-icons/fa-solid";
import { Box } from "@smooth-ui/core-sc";
import ComponentRender from "../../components/ComponentRender/ComponentRender";
import PageHeading from "../../components/page-items/Heading";
import PageParagraph from "../../components/page-items/Paragraph";
import PageImage from "../../components/page-items/Image";

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
  component
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

  // try and get the current component from those available
  let CurrentComponent;
  if (component) {
    // check for built-in Page Item types
    const builtIn = {
      heading: PageHeading,
      paragraph: PageParagraph,
      image: PageImage
    };
    if (Object.keys(builtIn).includes(component.component.type))
      CurrentComponent = builtIn[component.component.type];
    else
      CurrentComponent = window.__DECSYS__.Components[component.component.type];
  }

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
      height="100%"
      columnGap="0px"
      areas={["bar bar", "pages config"]}
      style={{ maxHeight: "100%" }}
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
          component={component}
          actions={pageListActions}
        />
      </Cell>
      <Cell area="config">
        <FlexBox flexDirection="column">
          {(component && (
            <ComponentRender
              component={<CurrentComponent />}
              params={component.component.params}
            />
          )) || (
            <Box mt={2}>
              <EmptyState
                message={
                  !survey.pages.length
                    ? "Get your Survey started with a new Page"
                    : "Select a Page Item to edit"
                }
                splash={!survey.pages.length ? <FileAlt /> : undefined}
                callToAction={
                  (!survey.pages.length && {
                    label: "Add a Page",
                    onClick: pageListActions.onAddClick
                  }) ||
                  undefined
                }
              />
            </Box>
          )}
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
    ({ editor: { survey, surveyLoaded, updateStates, component } }) => ({
      survey,
      component,
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
            dispatch(deletePageItem(id, pageId, componentId)),
          onClick: (pageId, component) =>
            dispatch(setCurrentComponent(id, pageId, component))
        },
        onComponentChange: (pageId, type, componentId, order) =>
          dispatch(changePageComponent(id, pageId, type, componentId, order)),
        onAddClick: () => dispatch(addPage(id)),
        onPageDragEnd: (pageId, newOrder) =>
          dispatch(reorderPage(id, pageId, newOrder)),
        onComponentDragEnd: (pageId, componentId, newOrder) =>
          dispatch(reorderComponent(id, pageId, componentId, newOrder))
      }
    })
  )(PureEditorScreen)
);

export { PureEditorScreen };

export default EditorScreen;
