import React from "react";
import TryThisAlert from "components/core/TryThisAlert";
import { Utf8ToBase64Url } from "services/data-structures";

export const EmailConfirmationRequired = ({ Email }) => (
  <TryThisAlert
    status="warning"
    text="That email address has been registered, but requires confirmation."
    linkText="Resend confirmation link"
    href={`/account/confirm/resend/${Utf8ToBase64Url(Email)}`}
  />
);
