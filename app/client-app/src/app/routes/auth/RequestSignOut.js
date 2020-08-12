import React, { useEffect } from "react";
import { getReturnUrl } from "auth/helpers";
import { IfFulfilled, IfRejected, useAsync } from "react-async";
import { Results } from "auth/constants";
import ErrorPage from "app/pages/Error";
import { useUsers } from "auth/UsersContext";

const signOut = async (users, returnUrl) => {
  const isAuthenticated = !!users.getUser()?.profile;
  if (isAuthenticated) return { status: Results.Success };

  // PopUp SignOut is an option here, but we don't do it.
  try {
    await users.signoutRedirect({
      useReplaceToNavigate: true,
      data: { returnUrl },
    });
    return { status: Results.Redirect };
  } catch (signOutError) {
    console.log("Sign Out Error: ", signOutError);
    return { status: Results.Fail, signOutError };
  }
};

const RequestSignOut = () => {
  const returnUrl = getReturnUrl();
  const { users } = useUsers();
  const { run, ...state } = useAsync({
    deferFn: () => signOut(users, returnUrl),
    suspense: true,
  });

  useEffect(() => {
    run();
  }, []); // eslint-disable-line

  return (
    <>
      <IfFulfilled state={state}>
        {({ status, message }) => {
          switch (status) {
            case Results.Redirect:
              break;
            case Results.Success:
              window.location.replace(returnUrl);
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

export default RequestSignOut;
