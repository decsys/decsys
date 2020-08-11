export const ApplicationName = "DECSYS";

const localPaths = {
  LoginForm: "login",
  LogoutIFrame: "logout",
  RequestSignIn: "request-signin",
  CompleteSignIn: "oidc-complete-signin",
  RequestSignOut: "request-signout",
  CompleteSignOut: "oidc-complete-signout",
};
export const Paths = {
  Origin: window.location.origin,

  // build absolute/relative Local Paths
  ...(() => {
    const prefix = "auth";
    return {
      Prefix: (absolute = false) => (absolute ? `/${prefix}` : prefix),
      ...Object.keys(localPaths).reduce((a, v) => {
        a[v] = (absolute = false) =>
          absolute ? `/${prefix}/${localPaths[v]}` : localPaths[v];
        return a;
      }, {}),
    };
  })(),
};

export const Results = {
  Redirect: "redirect",
  Success: "success",
  Fail: "fail",
};

export const QueryParams = {
  ReturnUrl: "returnUrl",
};

export const ClaimTypes = {
  Role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
};

export const Roles = {
  SurveyAdmin: "survey.admin",
};
