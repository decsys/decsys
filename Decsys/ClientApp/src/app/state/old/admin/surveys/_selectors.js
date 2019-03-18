export const isAnySurveyActive = surveys =>
  Object.keys(surveys).some(id => surveys[id].active);
