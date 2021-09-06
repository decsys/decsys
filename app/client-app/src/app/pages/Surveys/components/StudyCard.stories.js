import { StudyCard } from "./StudyCard";

/* eslint-disable-next-line */
export default {
  title: "Study Card",
  component: StudyCard,
};

const surveys = [{ id: 1, name: "My Survey", parent: 1 }];

export const Basic = () => <StudyCard id="123" surveys={surveys} />;
