import {
  createSurvey,
  uploadSurveyImport,
  loadInternalSurvey,
} from "api/surveys";

export const addSurveyActions = (navigate, mutateSurveys) => ({
  create: async (name, type, settings, isStudy) => {
    const { data: id } = await createSurvey(name, type, settings, isStudy);
    if (!isStudy) navigate(`survey/${id}`);
    else mutateSurveys();
  },
  importFile: async (file, importData, name, type, settings) => {
    await uploadSurveyImport(file, importData, name, type, settings);
    mutateSurveys();
  },
  loadInternal: async (internalKey, name, type, settings) => {
    await loadInternalSurvey(internalKey, name, type, settings);
    mutateSurveys();
  },
});
