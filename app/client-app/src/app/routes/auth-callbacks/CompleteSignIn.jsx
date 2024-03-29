import { useEffect } from "react";
import { IfFulfilled, IfRejected, useAsync } from "react-async";
import { Results } from "auth/constants";
import { Error } from "app/pages/Error";
import { getReturnUrl } from "auth/helpers";
import { users } from "auth/AuthContext";

const completeSignIn = async (url) => {
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

const CompleteSignIn = () => {
  const url = window.location.href;
  const { run, ...state } = useAsync({
    deferFn: () => completeSignIn(url),
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
              return <Error message={message} />;
            default:
              throw new Error(`Invalid Auth Result: ${status}`);
          }
          return null;
        }}
      </IfFulfilled>
      <IfRejected state={state}>
        {(error) => (
          <Error message="An authorization error occurred" error={error} />
        )}
      </IfRejected>
    </>
  );
};

export default CompleteSignIn;
