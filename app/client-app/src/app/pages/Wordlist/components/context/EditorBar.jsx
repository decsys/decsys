import { createContext, useContext, useState, useMemo } from "react";
import { editorBarActions } from "../actions/editorBarActions";
import { useFetchWordlist } from "./FetchWordlist";

const EditorBarContext = createContext({
  name: {
    save: () => {},
    isSaving: false,
    hasSaved: false,
  },
});

export const useEditorBarContext = () => useContext(EditorBarContext);

export const EditorBarContextProvider = ({ navigate, children }) => {
  const { id, mutate } = useFetchWordlist();

  const [nameState, setNameState] = useState({});

  const EditorBarActions = useMemo(
    () => editorBarActions(id, navigate, mutate, setNameState),
    [id, navigate, mutate, setNameState]
  );
  const value = { ...EditorBarActions, nameState };

  return <EditorBarContext.Provider value={value} children={children} />;
};
