import { ProgressCard } from "components/core";

const title = "Page 1";

const progressData = [
  { label: "1", progress: true },
  { label: "2", progress: true },
  { label: "3", progress: true },
  { label: "4", progress: true },
  { label: "5", progress: false },
  { label: "6", progress: false },
  { label: "7", progress: true },
  { label: "8", progress: true },
  { label: "9", progress: true },
  { label: "10", progress: true },
];
const story = {
  title: "Core UI/ProgressCard",
  component: ProgressCard,
};
export default story;

export const Basic = () => <ProgressCard title={title} total={10} />;

export const WithHeader = () => (
  <ProgressCard title={title} progressHeader="Participants" total={50} />
);

export const WithMessage = () => (
  <ProgressCard title={title} message="No progress data here" />
);

export const LowProfileBasic = () => (
  <ProgressCard title={title} lowProfile total={10} />
);

export const LowProfileHeader = () => (
  <ProgressCard
    title={title}
    lowProfile
    progressHeader="Participants"
    total={50}
  />
);

export const LowProfileMessage = () => (
  <ProgressCard title={title} message="No data" lowProfile />
);

export const WithData = () => (
  <ProgressCard
    title="Question 1"
    progressHeader="Participants"
    progressData={progressData.map(({ progress }) => ({
      progress,
    }))}
    total={10}
  />
);

// TODO: labelled data isn't a feature of ProgressCard currently
// export const WithLabelledData = () => (
//   <ProgressCard
//     title="Question 1"
//     progressHeader="Participants"
//     progressData={progressData}
//     total={20}
//   />
// );
