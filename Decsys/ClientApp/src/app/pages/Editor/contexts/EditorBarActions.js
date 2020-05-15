import { createContext, useContext } from "react";

const EditorBarActionsContext = createContext({
  name: {
    save: () => {},
    isSaving: false,
    hasSaved: false
  },
  duplicate: () => {},
  delete: () => {}
});

export const useEditorBarActions = () => useContext(EditorBarActionsContext);

export const EditorBarActionsProvider = EditorBarActionsContext.Provider;
