import { createContext, useContext } from "react";

const EditorBarContext = createContext({
  name: {
    save: () => {},
    isSaving: false,
    hasSaved: false
  },
  duplicate: () => {},
  delete: () => {}
});

export const useEditorBarContext = () => useContext(EditorBarContext);

export const EditorBarContextProvider = EditorBarContext.Provider;
