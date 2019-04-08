import { createContext } from "react";

const EditorBarContext = createContext({
  handleNameChange: () => {},
  handleDeleteClick: () => {},
  handleDuplicateClick: () => {}
});

export default EditorBarContext;
