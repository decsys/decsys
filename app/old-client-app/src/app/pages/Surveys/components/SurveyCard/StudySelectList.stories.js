import { StudySelectList } from "./SelectStudyModal";
import { toDictionary } from "services/data-structures";

/* eslint-disable-next-line */
export default {
  title: "Study Select List",
  component: StudySelectList,
  includeStories: /^[A-Z]/,
};

export const surveys = toDictionary([
  { id: 1, name: "Survey 1", activeInstanceId: 5 },
  {
    id: 2,
    name: "Study 1",
    isStudy: true,
    children: [
      { id: 3, name: "Survey 4", parentSurveyId: 1, activeInstanceId: 1 },
      { id: 4, name: "Survey 2", parentSurveyId: 1, activeInstanceId: 2 },
    ],
    activeInstanceId: 3,
    runCount: 3,
  },
  {
    id: 5,
    name: "Study 2",
    isStudy: true,
    runCount: 0,
  },
  { id: 3, name: "Survey 3" },
]);

export const Basic = () => <StudySelectList surveys={surveys} />;
