import { setSurveyName, duplicateSurvey, deleteSurvey } from "api/surveys";

export default (id, navigate, mutate, setNameState) => ({
  saveName: async (newName) => {
    setNameState({ isSaving: true });
    const { data: name } = await setSurveyName(id, newName);
    mutate((old) => ({ ...old, name }), false);
    setNameState({ hasSaved: true }); // this state update triggers a toast
    // whatever saved state side effects should have been triggered;
    // we don't want them to trigger erroneously on other re-renders
    setNameState({});
  },
  duplicate: async () => {
    const { data: newId } = await duplicateSurvey(id);
    navigate(`../${newId}`, {
      state: {
        toast: {
          position: "top",
          title: "Survey duplicated.",
          status: "success",
          duration: 2500,
          isClosable: true,
        },
      },
    });
  },
  deleteSurvey: async () => {
    await deleteSurvey(id);
    navigate("/admin", {
      state: {
        toast: {
          position: "top",
          title: "Survey deleted.",
          status: "success",
          duration: 2500,
          isClosable: true,
        },
      },
    });
  },
});
