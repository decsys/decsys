import { Router } from "@reach/router";
import { useQueryStringViewModel } from "hooks/useQueryString";
import React from "react";
import { FeedbackAlert, DefaultFeedback } from "./index";

const AccountApprovalComplete = ({ isApproved }) => {
  const { Email } = useQueryStringViewModel();
  return (
    <FeedbackAlert
      status={isApproved ? "success" : "warning"}
      title={`Account ${isApproved ? "Approved" : "Rejected"}`}
    >
      Account <strong>{Email}</strong> has been{" "}
      {isApproved ? "approved" : "rejected"}.
    </FeedbackAlert>
  );
};

const AccountApprovalFeedback = () => {
  const { errors } = useQueryStringViewModel();
  if (errors && errors.length) return <DefaultFeedback />;

  return (
    <Router>
      <AccountApprovalComplete isApproved path="approved" />
      <AccountApprovalComplete path="rejected" />
      <DefaultFeedback default />
    </Router>
  );
};
export default AccountApprovalFeedback;
