import {
  deleteSurvey,
  duplicateSurvey,
  launchSurvey,
  setSurveyName,
} from "api/surveys";
import { closeSurveyInstance } from "api/survey-instances";
import produce from "immer";

export default (navigate, mutateSurveys) => ({
  saveName: async (id, newName, setNameState) => {
    setNameState({ isSaving: true });
    const { data: name } = await setSurveyName(id, newName);
    mutateSurveys(
      produce((surveys) => {
        surveys[id].name = name;
      }),
      true
    );
    setNameState({ hasSaved: true }); // this state update triggers a toast
    // whatever saved state side effects should have been triggered;
    // we don't want them to trigger erroneously on other re-renders
    setNameState({});
  },
  launch: async (id) => {
    const { data } = await launchSurvey(id);
    mutateSurveys(
      produce((surveys) => {
        surveys[id].activeInstanceId = data;
        surveys[id].runCount++;
      })
    );
  },
  close: async (id, instanceId) => {
    await closeSurveyInstance(id, instanceId);
    mutateSurveys(
      produce((surveys) => {
        surveys[id].activeInstanceId = null;
      })
    );
  },
  duplicate: async (id) => {
    await duplicateSurvey(id);
    mutateSurveys();
  },
  deleteSurvey: async (id) => {
    await deleteSurvey(id);
    mutateSurveys();
  },
  navigate,
});
