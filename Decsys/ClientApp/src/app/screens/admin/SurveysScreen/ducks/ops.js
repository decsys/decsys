import * as actions from "./actions";
import * as api from "../../../../api";

export const createSurvey = () => async (_, nav) => {
  const { data: id } = await api.createSurvey();
  nav.navigate(`admin/survey/${id}`);
};

export const importSurvey = (file, importData) => async dispatch => {
  await api.uploadSurveyImport(file, importData);
  const { data: surveyList } = await api.listSurveys();
  dispatch(actions.fetchSurveys(surveyList));
};

export const loadInternalSurvey = type => async dispatch => {
  await api.loadInternalSurvey(type);
  const { data: surveyList } = await api.listSurveys();
  dispatch(actions.fetchSurveys(surveyList));
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
