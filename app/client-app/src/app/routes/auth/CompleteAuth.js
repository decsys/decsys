import React, { useEffect } from "react";
import { IfFulfilled, IfRejected, useAsync } from "react-async";
import { Results } from "auth/constants";
import ErrorPage from "app/pages/Error";
import { getReturnUrl } from "auth/helpers";
import { useUsers } from "auth/UsersContext";

const completeSignIn = async (users, url) => {
  try {
    const user = await users.signinCallback(url);
    return {
      status: Results.Success,
      state: user && user.state,
    };
  } catch (error) {
    const generalError = "There was an error signing in";
    console.error(generalError, ": ", error);
    return {
      status: Results.Fail,
      message: `${generalError}.`,
    };
  }
};

const completeSignOut = async (users, url) => {
  try {
    const response = await users.signoutCallback(url);
    return {
      status: Results.Success,
      state: response && response.data,
    };
  } catch (error) {
    console.error("There was an error signing out:", error);
    return { status: Results.Fail, error };
  }
};

const CompleteAuth = ({ completionFn }) => {
  const url = window.location.href;
  const { users } = useUsers();
  const { run, ...state } = useAsync({
    deferFn: () => completionFn(users, url),
    suspense: true,
  });

  useEffect(() => {
    run();
  }, []); // eslint-disable-line

  return (
    <>
      <IfFulfilled state={state}>
        {({ status, state, message }) => {
          switch (status) {
            case Results.Redirect:
              throw new Error(`Invalid Auth Result for this flow: ${status}`);
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

export const CompleteSignIn = () => (
  <CompleteAuth completionFn={completeSignIn} />
);
export const CompleteSignOut = () => (
  <CompleteAuth completionFn={completeSignOut} />
);
