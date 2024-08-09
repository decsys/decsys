import { setWordlistName } from "api/wordlist";

export const editorBarActions = (id, navigate, mutate, setNameState) => ({
  saveName: async (newName) => {
    setNameState({ isSaving: true });
    const { data: name } = await setWordlistName(id, newName);
    mutate((old) => ({ ...old, name }), false);
    setNameState({ hasSaved: true }); // this state update triggers a toast
    // whatever saved state side effects should have been triggered;
    // we don't want them to trigger erroneously on other re-renders
    setNameState({});
  },
});
