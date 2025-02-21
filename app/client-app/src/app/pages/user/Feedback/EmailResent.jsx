import { useQueryStringViewModel } from "hooks/useQueryString";
import { FeedbackAlert } from "./index";

export const AccountResentComplete = () => {
  const { errors, Email } = useQueryStringViewModel();

  if (errors && errors.length) {
    return (
      <FeedbackAlert
        status={"warning"}
        title={`There was an error sending the email`}
      >
        {errors}
      </FeedbackAlert>
    );
  }
  return (
    <FeedbackAlert status={"success"} title={`Email Resent`}>
      Approval request email for <strong>{Email}</strong> has been resent.
    </FeedbackAlert>
  );
};
