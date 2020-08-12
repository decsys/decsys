import { Paths, ApplicationName } from "./constants";
import { WebStorageStateStore } from "oidc-client";

export default {
  oidc: {
    authority: Paths.Origin,
    client_id: "decsys-client-app",
    redirect_uri: `${Paths.Origin}${Paths.CompleteSignIn(true)}`,
    response_type: "code",
    response_mode: "query",
    scope: "openid profile roles survey.admin",
    post_logout_redirect_uri: `${Paths.Origin}${Paths.CompleteSignOut(true)}`,
    automaticSilentRenew: true,
    includeIdTokenInSilentRenew: true,
    userStore: new WebStorageStateStore({
      prefix: `${ApplicationName}.`,
    }),
  },
  unauthorized_uri: Paths.RequestSignIn(true),
};
