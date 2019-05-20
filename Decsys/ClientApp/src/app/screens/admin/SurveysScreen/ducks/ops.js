import * as actions from "./actions";
import * as api from "../../../../api";

export const createSurvey = () => async (_, nav) => {
  // create the survey
  const { data: id } = await api.createSurvey();
  // redirect to the editor with this survey
  //await dispatch(setSurveyPlaceholder("Untitled Survey")); // TODO: Routing state?
  nav.navigate(`admin/survey/${id}`);
};

export const importSurvey = file => async (_, nav) => {
  await api.uploadSurveyImport(file);
  // then what?
  nav.navigate("admin"); //ugh
};

export const deleteSurvey = id => async dispatch => {
  await api.deleteSurvey(id);
  dispatch(actions.deleteSurvey(id));
};

export const duplicateSurvey = id => async dispatch => {
  await api.duplicateSurvey(id);
  const { data: surveyList } = await api.listSurveys();
  dispatch(actions.fetchSurveys(surveyList));
};

export const launchSurvey = id => async dispatch => {
  const { data: instanceId } = await api.launchSurvey(id);
  dispatch(actions.launchSurvey(id, instanceId));
};

export const closeSurvey = (surveyId, instanceId) => async dispatch => {
  await api.closeSurveyInstance(surveyId, instanceId);
  dispatch(actions.closeSurvey(surveyId));
};
