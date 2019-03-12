import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import TaskList from "./TaskList";

const Inbox = ({ error }) => {
  if (error) return <div>Something gone wrong buddy</div>;

  return (
    <div>
      <h1>Tasks</h1>
      <TaskList />
    </div>
  );
};

Inbox.propTypes = {
  error: PropTypes.string
};

Inbox.defaultProps = {
  error: null
};

export { Inbox };

export default connect(({ error }) => ({ error }))(Inbox);
