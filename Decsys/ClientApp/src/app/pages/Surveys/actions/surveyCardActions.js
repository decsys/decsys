import { deleteSurvey, duplicateSurvey, launchSurvey } from "api/surveys";
import { closeSurveyInstance } from "api/survey-instances";
import produce from "immer";
import { saveSurveyConfig } from "api/survey-config";

export default (navigate, mutateSurveys) => ({
  launch: async id => {
    const { data } = await launchSurvey(id);
    mutateSurveys(
      produce(surveys => {
        surveys[id].activeInstanceId = data;
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
