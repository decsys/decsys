import axios from "axios";

export const createSurveyPage = id => axios.post(`/api/surveys/${id}/pages`);
