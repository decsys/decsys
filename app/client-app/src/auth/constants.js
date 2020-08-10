export const ApplicationName = "DECSYS";

const localPaths = {
  LoginForm: "login",
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
