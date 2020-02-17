import React from "react";
import { storiesOf } from "@storybook/react";
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

storiesOf("Common UI/ProgressCard", module)
  .add("Default", () => <ProgressCard title="Question 1" total={10} />)
  .add("With Header", () => (
    <ProgressCard title="Question 1" progressHeader="Participants" total={50} />
  ))
  .add("With data", () => (
    <ProgressCard
      title="Question 1"
      progressHeader="Participants"
      progressData={progressData.map(({ complete }) => ({
        complete
      }))}
      total={10}
    />
  ))
  .add("With labelled data", () => (
    <ProgressCard
      title="Question 1"
      progressHeader="Participants"
      progressData={progressData}
      total={20}
    />
  ));
