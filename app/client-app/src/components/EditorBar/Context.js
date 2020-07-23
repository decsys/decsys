import { createContext } from "react";

const EditorBarContext = createContext({
  nameUpdateState: {},
  handleNameChange: () => {},
  handleDeleteClick: () => {},
  handleDuplicateClick: () => {}
});

export default EditorBarContext;
