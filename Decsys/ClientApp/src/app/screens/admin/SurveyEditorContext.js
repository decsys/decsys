import React, { createContext } from "react";

export const SurveyEditorContext = createContext({});

// const navigation = useNavigation();

//   const handleDeleteClick = async () => {
//     await api.deleteSurvey(id);
//     navigation.navigate("/admin");
//   };

//   const handleDuplicateClick = async () => {
//     const { data: newId } = await api.duplicateSurvey(id);
//     navigation.navigate(`/admin/survey/${newId}`);
//   };

// connect(
//     ({ editor: { survey, surveyLoaded, updateStates, component } }) => ({
//       survey,
//       component,
//       surveyLoaded,
//       updateStates,
//       components: Object.keys(window.__DECSYS__.Components).map(type => ({
//         type,
//         icon: window.__DECSYS__.Components[type].icon
//       }))
//     }),
//     (dispatch, { id }) => ({
//       onNameChange: ({ target: { value } }) =>
//         dispatch(ducks.editName(id, value)),
//       onParamChange: (pageId, componentId, paramKey, value) =>
//         dispatch(ducks.editParam(id, pageId, componentId, paramKey, value)),
//       onImageAddClick: (pageId, componentId, file, extension) =>
//         dispatch(ducks.uploadImage(id, pageId, componentId, file, extension)),
//       onImageRemoveClick: (pageId, componentId) =>
//         dispatch(ducks.removeImage(id, pageId, componentId)),
//       pageListActions: {
//         pageActions: {
//           onRandomToggle: () => dispatch({ type: "SET_PAGE_RANDOM_STATE" }),
//           onDuplicateClick: pageId => dispatch(ducks.duplicatePage(id, pageId)),
//           onDeleteClick: pageId => dispatch(ducks.deletePage(id, pageId)),
//           onAddPageItemClick: (pageId, type) =>
//             dispatch(ducks.addPageItem(id, pageId, type))
//         },
//         itemActions: {
//           onDuplicateClick: (pageId, componentId) =>
//             dispatch(ducks.duplicatePageItem(id, pageId, componentId)),
//           onDeleteClick: (pageId, componentId) =>
//             dispatch(ducks.deletePageItem(id, pageId, componentId)),
//           onClick: (pageId, component) =>
//             dispatch(ducks.setCurrentComponent(id, pageId, component))
//         },
//         onComponentChange: (pageId, type, componentId, order) =>
//           dispatch(
//             ducks.changePageComponent(id, pageId, type, componentId, order)
//           ),
//         onAddClick: () => dispatch(ducks.addPage(id)),
//         onPageDragEnd: (pageId, newOrder) =>
//           dispatch(ducks.reorderPage(id, pageId, newOrder)),
//         onComponentDragEnd: (pageId, componentId, newOrder) =>
//           dispatch(ducks.reorderComponent(id, pageId, componentId, newOrder))
//       }
//     })
//   )(PureEditorScreen)
