import {
  createSurvey,
  uploadSurveyImport,
  loadInternalSurvey,
} from "api/surveys";

export const addSurveyActions = (navigate, mutateSurveys) => ({
  create: async (name, type, settings, creationOptions = {}, folderName) => {
    const { data: id } = await createSurvey(
      name,
      type,
      settings,
      creationOptions,
      folderName
    );
    if (!creationOptions.isStudy) navigate(`/admin/surveys/${id}`);
    else if (folderName) {
      navigate(`/admin/folders/${folderName}`);
      mutateSurveys();
    } else mutateSurveys();
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
