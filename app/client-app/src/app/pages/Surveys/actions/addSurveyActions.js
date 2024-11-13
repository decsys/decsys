import {
  createSurvey,
  uploadSurveyImport,
  loadInternalSurvey,
} from "api/surveys";

export const addSurveyActions = (navigate, mutateSurveys) => ({
  create: async (name, type, settings, creationOptions = {}) => {
    const { data: id } = await createSurvey(
      name,
      type,
      settings,
      creationOptions
    );
    if (!creationOptions.isStudy) navigate(`/admin/surveys/${id}`);
    else mutateSurveys();
  },
  importFile: async (
    file,
    importData,
    name,
    type,
    settings,
    creationOptions
  ) => {
    await uploadSurveyImport(
      file,
      importData,
      name,
      type,
      settings,
      creationOptions
    );
    mutateSurveys();
  },
  loadInternal: async (internalKey, name, type, settings, parentId) => {
    await loadInternalSurvey(internalKey, name, type, settings, parentId);
    mutateSurveys();
  },
});
