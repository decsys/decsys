import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditorBar from "../../components/EditorBar";
import { Grid, Cell } from "styled-css-grid";
import EditorPageList from "../../components/EditorPageList";
import { LoadingIndicator, FlexBox, EmptyState } from "../../components/ui";
import * as ducks from "../../state/ducks/editor";
import { FileAlt } from "styled-icons/fa-solid";
import { Box } from "@smooth-ui/core-sc";
import ComponentRender from "../../components/ComponentRender";
import ComponentEditor from "../../components/ComponentEditor";
import PageHeading from "../../components/page-items/Heading";
import PageParagraph from "../../components/page-items/Paragraph";
import PageImage from "../../components/page-items/Image";
import ParagraphPreview from "../../components/ComponentEditor/ParagraphPreview";
import ImageUpload from "../../components/ComponentEditor/ImageUpload";

const PureEditorScreen = ({
  id,
  survey,
  surveyLoaded,
  updateStates,
  components,
  onNameChange,
  onParamChange,
  onImageAddClick,
  onImageRemoveClick,
  onDeleteClick,
  onDuplicateClick,
  pageListActions,
  component
}) => {
  // Configure the base Editor Bar so we don't pass props multiple times
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
    if (Object.keys(builtIn).includes(component.component.type)) {
      CurrentComponent = builtIn[component.component.type];
    } else {
      CurrentComponent = window.__DECSYS__.Components[component.component.type];
    }
  }

  return !surveyLoaded ? (
    <FlexBox flexDirection="column">
      <SurveyEditorBar disabled />
      <LoadingIndicator />
    </FlexBox>
  ) : (
    <Grid
      columns="1fr 2fr"
      rows="auto 1fr 1fr"
      rowGap="0px"
      height="100%"
      columnGap="0px"
      style={{ maxHeight: "100%" }}
    >
      <Cell width={2}>
        <SurveyEditorBar />
      </Cell>
      <Cell
        height={2}
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

      {(component && (
        <>
          <Cell style={{ padding: "1em" }}>
            {component.component.type === "paragraph" ? (
              <ParagraphPreview
                component={CurrentComponent}
                params={component.component.params}
                onChange={e =>
                  onParamChange(
                    component.pageId,
                    component.component.id,
                    "text",
                    e.target.value
                  )
                }
              />
            ) : (
              <ComponentRender
                component={CurrentComponent}
                params={
                  component.component.type === "image"
                    ? {
                        ...component.component.params,
                        surveyId: id,
                        id: component.component.id
                      }
                    : component.component.params
                }
              />
            )}
          </Cell>
          <Cell style={{ padding: "1em" }}>
            {component.component.type === "image" ? (
              <ImageUpload
                params={component.component.params}
                onAddClick={(file, extension) =>
                  onImageAddClick(
                    component.pageId,
                    component.component.id,
                    file,
                    extension
                  )
                }
                onRemoveClick={() =>
                  onImageRemoveClick(component.pageId, component.component.id)
                }
              />
            ) : (
              <ComponentEditor
                onChange={(paramKey, value) =>
                  onParamChange(
                    component.pageId,
                    component.component.id,
                    paramKey,
                    value
                  )
                }
                component={CurrentComponent}
                params={component.component.params}
              />
            )}
          </Cell>
        </>
      )) || (
        <Cell height={2}>
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
        </Cell>
      )}
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
      onNameChange: ({ target: { value } }) =>
        dispatch(ducks.editName(id, value)),
      onParamChange: (pageId, componentId, paramKey, value) =>
        dispatch(ducks.editParam(id, pageId, componentId, paramKey, value)),
      onImageAddClick: (pageId, componentId, file, extension) =>
        dispatch(ducks.uploadImage(id, pageId, componentId, file, extension)),
      onImageRemoveClick: (pageId, componentId) =>
        dispatch(ducks.removeImage(id, pageId, componentId)),
      onDuplicateClick: () => dispatch(ducks.duplicateSurvey(id)),
      onDeleteClick: () => dispatch(ducks.deleteSurvey(id)),
      pageListActions: {
        pageActions: {
          onRandomToggle: () => dispatch({ type: "SET_PAGE_RANDOM_STATE" }),
          onDuplicateClick: pageId => dispatch(ducks.duplicatePage(id, pageId)),
          onDeleteClick: pageId => dispatch(ducks.deletePage(id, pageId)),
          onAddPageItemClick: (pageId, type) =>
            dispatch(ducks.addPageItem(id, pageId, type))
        },
        itemActions: {
          onDuplicateClick: (pageId, componentId) =>
            dispatch(ducks.duplicatePageItem(id, pageId, componentId)),
          onDeleteClick: (pageId, componentId) =>
            dispatch(ducks.deletePageItem(id, pageId, componentId)),
          onClick: (pageId, component) =>
            dispatch(ducks.setCurrentComponent(id, pageId, component))
        },
        onComponentChange: (pageId, type, componentId, order) =>
          dispatch(
            ducks.changePageComponent(id, pageId, type, componentId, order)
          ),
        onAddClick: () => dispatch(ducks.addPage(id)),
        onPageDragEnd: (pageId, newOrder) =>
          dispatch(ducks.reorderPage(id, pageId, newOrder)),
        onComponentDragEnd: (pageId, componentId, newOrder) =>
          dispatch(ducks.reorderComponent(id, pageId, componentId, newOrder))
      }
    })
  )(PureEditorScreen)
);

export { PureEditorScreen };

export default EditorScreen;
