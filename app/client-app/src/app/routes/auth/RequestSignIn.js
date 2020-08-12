import React from "react";
import { getReturnUrl } from "auth/helpers";
import { IfFulfilled, IfRejected, useAsync } from "react-async";
import { Results } from "auth/constants";
import ErrorPage from "app/pages/Error";
import { useUsers } from "auth/UsersContext";
import Loading from "app/pages/Loading";

const signIn = async ({ users, returnUrl }) => {
  try {
    // We try to see if we can authenticate the user silently.
    // This happens when the user is already logged in on the IdP
    // and is done using a hidden iframe on the client.
    await users.signinSilent({
      useReplaceToNavigate: true,
    });
    return {
      status: Results.Success,
      state: { returnUrl },
    };
  } catch (silentError) {
    // It's possible to do a popup auth window here, but that feels more
    // appropriate for third-party apps, not first party (but external) apps.

    // Silent sign in failed; redirect to the IdP for traditional sign in flow
    try {
      await users.signinRedirect({
        useReplaceToNavigate: true,
        data: { returnUrl },
      });
      return { status: Results.Redirect };
    } catch (signInError) {
      console.error("Sign In Error: ", signInError);
      return { status: Results.Fail, signInError };
    }
  }
};

const RequestSignIn = () => {
  const returnUrl = getReturnUrl();
  const { users } = useUsers();
  const { run, ...state } = useAsync(signIn, {
    users,
    returnUrl,
    suspense: true,
  });

  return (
    <>
      <IfFulfilled state={state}>
        {({ status, state, message }) => {
          switch (status) {
            case Results.Redirect:
              return <Loading />; // Redirect is fine; it will redirect to the IdP in due course
            case Results.Success:
              window.location.replace(getReturnUrl(state));
              break;
            case Results.Fail:
              return <ErrorPage message={message} />;
            default:
              throw new Error(`Invalid Auth Result: ${status}`);
          }
          return null;
        }}
      </IfFulfilled>
      <IfRejected state={state}>
        {(error) => (
          <ErrorPage message="An authorization error occurred" error={error} />
        )}
      </IfRejected>
    </>
  );
};

export default RequestSignIn;
