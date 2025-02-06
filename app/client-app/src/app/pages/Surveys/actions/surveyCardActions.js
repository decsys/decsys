import {
  deleteSurvey,
  duplicateSurvey,
  launchSurvey,
  setSurveyName,
  setParent,
  setSurveyFolder,
} from "api/surveys";
import { deleteFolder } from "api/folder";
import { closeSurveyInstance } from "api/survey-instances";
import produce from "immer";
import { saveSurveySettings } from "api/survey-config";

export const surveyCardActions = (navigate, mutateSurveys) => ({
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
  duplicate: async (
    id,
    name,
    type,
    settings,
    creationOptions,
    parentFolderName
  ) => {
    await duplicateSurvey(
      id,
      name,
      type,
      settings,
      creationOptions,
      parentFolderName
    );
    mutateSurveys();
  },
  changeStudy: async (id, parentId) => {
    await setParent(id, parentId);
    mutateSurveys();
  },
  setSurveyFolder: async (id, folderName) => {
    await setSurveyFolder(id, folderName);
    mutateSurveys();
  },
  deleteFolder: async (name) => {
    await deleteFolder(name);
    mutateSurveys();
  },
  deleteSurvey: async (id) => {
    await deleteSurvey(id);
    mutateSurveys();
  },
  saveSettings: async (id, settings) => {
    await saveSurveySettings(id, settings);
    mutateSurveys();
  },
  navigate,
});
