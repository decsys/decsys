import React from "react";
import PropTypes from "prop-types";
import Task from "./Task";
import { connect } from "react-redux";
import { archiveTask, pinTask } from "./redux";

const TaskList = ({ loading, tasks, onPinTask, onArchiveTask }) => {
  if (loading) return <div>loading...</div>;

  if (tasks.length === 0) return <div>There are no tasks!</div>;

  return (
    <div>
      {tasks.map(task => (
        <Task key={task.id} task={task} {...{ onPinTask, onArchiveTask }} />
      ))}
    </div>
  );
};

TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired
};

TaskList.defaultProps = {
  loading: false
};

export { TaskList };
export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(
      t => t.state === "TASK_INBOX" || t.state === "TASK_PINNED"
    )
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id))
  })
)(TaskList);
