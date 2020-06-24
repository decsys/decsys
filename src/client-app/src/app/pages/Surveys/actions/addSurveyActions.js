import {
  createSurvey,
  uploadSurveyImport,
  loadInternalSurvey
} from "api/surveys";

export default (navigate, mutateSurveys) => ({
  create: async () => {
    const { data: id } = await createSurvey();
    navigate(`survey/${id}`);
  },
  importFile: async (file, importData) => {
    await uploadSurveyImport(file, importData);
    mutateSurveys();
  },
  loadInternal: async type => {
    await loadInternalSurvey(type);
    mutateSurveys();
  }
});
