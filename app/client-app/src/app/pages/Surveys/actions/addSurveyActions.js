import {
  createSurvey,
  uploadSurveyImport,
  loadInternalSurvey,
} from "api/surveys";

export const addSurveyActions = (navigate, mutateSurveys) => ({
  create: async (name, type, settings) => {
    const { data: id } = await createSurvey(name, type, settings);
    navigate(`survey/${id}`);
  },
  importFile: async (file, importData) => {
    await uploadSurveyImport(file, importData);
    mutateSurveys();
  },
  loadInternal: async (type) => {
    await loadInternalSurvey(type);
    mutateSurveys();
  },
});
