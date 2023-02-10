import React from "react";
import { Question, QuestionProps } from "./Question";

export default {
  title: "core/Question",
  component: Question,
  decorators: [
    (Story) => (
      <div
        style={{
          height: "300px",
          width: "100%",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const Basic = (args: QuestionProps) => <Question {...args} />;
Basic.args = {
  children: "Hello there!",
};
