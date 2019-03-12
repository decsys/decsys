import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { TaskList } from "./TaskList";
import { task, actions } from "./Task.stories";

export const defaultTasks = [
  task,
  { ...task, id: 2, title: "Task 2" },
  { ...task, id: 3, title: "Task 3" }
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 2),
  { id: 3, title: "Task 3 (pinned)", state: "TASK_PINNED" }
];

storiesOf("TaskList", module)
  .add("Default", () => <TaskList tasks={defaultTasks} {...actions} />)
  .add("withPinnedTasks", () => (
    <TaskList tasks={withPinnedTasks} {...actions} />
  ))
  .add("loading", () => <TaskList loading tasks={[]} {...actions} />)
  .add("empty", () => <TaskList tasks={[]} {...actions} />);
