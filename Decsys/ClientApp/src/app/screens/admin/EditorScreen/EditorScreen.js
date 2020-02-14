import React from "react";
import { useNaviReducer } from "utils/hooks";
import PureEditorScreen from "./PureEditorScreen";
import EditorBarContext from "components/EditorBar/Context";
import reducer, * as ducks from "./ducks";
import { useCurrentRoute } from "react-navi";

// TODO: PropTypes

const EditorScreen = () => {
  const { survey } = useCurrentRoute().data;
  const components = Object.keys(window.__DECSYS__.Components).map(type => ({
    type,
    icon: window.__DECSYS__.Components[type].icon
  }));

  const [state, dispatch] = useNaviReducer(reducer, {
    survey,
    nameUpdateState: {}
  });

  const editorBarActions = {
    handleNameChange: ({ target: { value } }) =>
      dispatch(ducks.editName(survey.id, value)),
    handleDeleteClick: () => dispatch(ducks.deleteSurvey(survey.id)),
    handleDuplicateClick: () => dispatch(ducks.duplicateSurvey(survey.id))
  };

  const paramActions = {
    onParamChange: (pageId, componentId, paramKey, value) =>
      dispatch(
        ducks.editParam(survey.id, pageId, componentId, paramKey, value)
      ),
    onImageAddClick: (pageId, componentId, file, extension) => {
      dispatch(
        ducks.uploadImage(survey.id, pageId, componentId, file, extension)
      );
    },
    onImageRemoveClick: (pageId, componentId) => {
      dispatch(ducks.removeImage(survey.id, pageId, componentId));
    }
  };

  const pageListActions = {
    pageActions: {
      onRandomToggle: (pageId, randomize) =>
        dispatch(ducks.setPageRandomize(survey.id, pageId, randomize)),
      onDuplicateClick: pageId =>
        dispatch(ducks.duplicatePage(survey.id, pageId)),
      onDeleteClick: pageId => dispatch(ducks.deletePage(survey.id, pageId)),
      onAddPageItemClick: (pageId, type) =>
        dispatch(ducks.addPageItem(survey.id, pageId, type))
    },
    itemActions: {
      onDuplicateClick: (pageId, componentId) =>
        dispatch(ducks.duplicatePageItem(survey.id, pageId, componentId)),
      onDeleteClick: (pageId, componentId) =>
        dispatch(ducks.deletePageItem(survey.id, pageId, componentId)),
      onClick: (pageId, component) =>
        dispatch(ducks.setCurrentComponent(survey.id, pageId, component))
    },
    onComponentChange: (pageId, type, componentId, order) =>
      dispatch(
        ducks.changePageComponent(survey.id, pageId, type, componentId, order)
      ),
    onAddClick: () => dispatch(ducks.addPage(survey.id)),
    onPageDragEnd: (pageId, newOrder) =>
      dispatch(ducks.reorderPage(survey.id, pageId, newOrder)),
    onComponentDragEnd: (pageId, componentId, newOrder) =>
      dispatch(ducks.reorderComponent(survey.id, pageId, componentId, newOrder))
  };

  return (
    <EditorBarContext.Provider
      value={{ ...editorBarActions, nameUpdateState: state.nameUpdateState }}
    >
      <PureEditorScreen
        survey={state.survey}
        components={components}
        {...paramActions}
        pageListActions={pageListActions}
        component={state.component}
      />
    </EditorBarContext.Provider>
  );
};

export default EditorScreen;
