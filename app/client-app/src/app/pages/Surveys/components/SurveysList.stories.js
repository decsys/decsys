import SurveysList from "./SurveysList";

/* eslint-disable-next-line */
export default {
  title: "SurveysList",
  component: SurveysList,
};

const surveys = [
  { id: 0, name: "Survey 1", activeInstanceId: 5 },
  {
    id: 1,
    name: "Study 1",
    isStudy: true,
    children: [
      { id: 3, name: "Survey 4", parent: 1, activeInstanceId: 1 },
      { id: 4, name: "Survey 2", parent: 1, activeInstanceId: 2 },
    ],
    activeInstanceId: 3,
  },
  {
    id: 5,
    name: "Study 2",
    isStudy: true,
  },
  { id: 2, name: "Survey 3" },
];

export const Basic = () => <SurveysList surveys={surveys} />;
