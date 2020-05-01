import {
  deleteSurvey,
  duplicateSurvey,
  launchSurvey,
  closeSurveyInstance
} from "api/surveys";
import produce from "immer";

export default (navigate, mutateSurveys) => ({
  launch: async id => {
    const instanceId = await launchSurvey(id);
    mutateSurveys(
      produce(surveys => {
        surveys[id].activeInstanceId = instanceId;
        surveys[id].runCount++;
      })
    );
  },
  close: async (id, instanceId) => {
    await closeSurveyInstance(id, instanceId);
    mutateSurveys(
      produce(surveys => {
        surveys[id].activeInstanceId = null;
      })
    );
  },
  duplicate: async id => {
    await duplicateSurvey(id);
    mutateSurveys();
  },
  deleteSurvey: async id => {
    await deleteSurvey(id);
    mutateSurveys();
  },
  navigate
});
