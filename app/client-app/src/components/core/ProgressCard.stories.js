import { ProgressCard } from "components/core";

const title = "Page 1";

const progressData = [
  { label: "1", complete: true },
  { label: "2", complete: true },
  { label: "3", complete: true },
  { label: "4", complete: true },
  { label: "5", complete: false },
  { label: "6", complete: false },
  { label: "7", complete: true },
  { label: "8", complete: true },
  { label: "9", complete: true },
  { label: "10", complete: true },
];

export default {
  title: "Core UI/ProgressCard",
  component: ProgressCard,
  args: {
    title: "Question 1",
    total: 10,
  },
};

const Template = (args) => <ProgressCard {...args} />;

export const Basic = Template.bind({});

export const WithHeader = Template.bind({});
WithHeader.args = {
  progressHeader: "Participants",
};
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

export const WithData = Template.bind({});
WithData.args = {
  ...WithHeader.args,
  progressData: progressData.map(({ complete }) => ({
    complete,
  })),
};

export const WithLabelledData = Template.bind({});
WithLabelledData.args = {
  ...WithHeader.args,
  progressData,
  total: 20,
};
