import { resendEmail } from "api/account";
import { FeedbackAlert } from ".";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { Box, Button } from "@chakra-ui/react";

export const TokenExpiredFeedback = () => {
  const { errors, userId } = useQueryStringViewModel();
  const handleResendApprovalEmail = async (userId) => {
    await resendEmail(userId);
  };

  return (
    <FeedbackAlert title="Token Expired" status="error">
      <Box>{errors}.</Box>
      <Button
        colorScheme="blue"
        mt={4}
        onClick={() => handleResendApprovalEmail(userId)}
      >
        Resend Approval Email
      </Button>
    </FeedbackAlert>
  );
};
