import React from "react";
import PropTypes from "prop-types";
import { Star } from "styled-icons/fa-solid";

const Task = ({ task: { id, title, state }, onArchiveTask, onPinTask }) => {
  let style = {};
  switch (state) {
    case "TASK_PINNED":
      style.backgroundColor = "blue";
      break;
    case "TASK_ARCHIVED":
      style.backgroundColor = "grey";
      break;
    default:
  }
  return (
    <div style={style}>
      <label>
        <input
          type="checkbox"
          defaultChecked={state === "TASK_ARCHIVED"}
          name="checked"
          onClick={() => onArchiveTask(id)}
        />
      </label>
      <input value={title} readonly placeholder="Task title..." />
      <div onClick={event => event.stopPropagation()}>
        {state !== "TASK_ARCHIVED" && (
          <a onClick={() => onPinTask(id)}>
            <Star size="1em" />
          </a>
        )}
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.oneOf(["TASK_INBOX", "TASK_PINNED", "TASK_ARCHIVED"])
      .isRequired
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func
};

export default Task;
