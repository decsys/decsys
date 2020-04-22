import { createContext } from "react";

const SurveyCardContext = createContext({
  handleDuplicateClick: () => {},
  handleDeleteClick: () => {},
  handleEditClick: () => {},
  handleLaunchClick: () => {},
  handleCloseClick: () => {},
  fetchSurveyConfig: () => {},
  handleSurveyConfigSaveClick: () => {}
});

export default SurveyCardContext;
