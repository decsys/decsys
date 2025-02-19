import { useQueryStringViewModel } from "hooks/useQueryString";
import TryThisAlert from "components/core/TryThisAlert";

export const TokenExpired = () => {
  const { errors, userId } = useQueryStringViewModel();
  return (
    <TryThisAlert
      status="warning"
      text={errors}
      linkText="Approval email link."
      href={`/Account/confirm/resend/token/${userId}`}
    />
  );
};
