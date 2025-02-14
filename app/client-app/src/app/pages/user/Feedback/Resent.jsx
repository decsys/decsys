import { Router } from "@reach/router";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { FeedbackAlert, DefaultFeedback } from "./index";

const AccountResentComplete = () => {
  const { Email } = useQueryStringViewModel();
  return (
    <Router>
      <FeedbackAlert status={"success"} title={`Email Resent}`}>
        Approvel request email for <strong>{Email}</strong> has been resent.
      </FeedbackAlert>
    </Router>
  );
};

export default AccountResentComplete;
