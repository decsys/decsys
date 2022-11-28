import { createContext, useContext, useState, useMemo } from "react";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { editorBarActions } from "../actions/editorBarActions";

const EditorBarContext = createContext({
  name: {
    save: () => {},
    isSaving: false,
    hasSaved: false,
  },
  duplicate: () => {},
  delete: () => {},
});

export const useEditorBarContext = () => useContext(EditorBarContext);

export const EditorBarContextProvider = ({ navigate, children }) => {
  const { id, mutate } = useFetchSurvey();

  const [nameState, setNameState] = useState({});

  const EditorBarActions = useMemo(
    () => editorBarActions(id, navigate, mutate, setNameState),
    [id, navigate, mutate, setNameState]
  );
  const value = { ...EditorBarActions, nameState };

  return <EditorBarContext.Provider value={value} children={children} />;
};
