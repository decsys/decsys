import React from "react";
import { ProgressCard } from "components/core";

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
  { label: "10", complete: true }
];

export default {
  title: "Core UI/ProgressCard",
  component: ProgressCard
};

export const Basic = () => <ProgressCard title="Question 1" total={10} />;

export const WithHeader = () => (
  <ProgressCard title="Question 1" progressHeader="Participants" total={50} />
);

export const WithData = () => (
  <ProgressCard
    title="Question 1"
    progressHeader="Participants"
    progressData={progressData.map(({ complete }) => ({
      complete
    }))}
    total={10}
  />
);

export const WithLabelledData = () => (
  <ProgressCard
    title="Question 1"
    progressHeader="Participants"
    progressData={progressData}
    total={20}
  />
);
