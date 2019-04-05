import { createContext } from "react";

const SurveyCardContext = createContext({
  handleDuplicateClick: () => {},
  handleDeleteClick: () => {},
  handleEditClick: () => {},
  handleLaunchClick: () => {},
  handleCloseClick: () => {}
});

export default SurveyCardContext;
